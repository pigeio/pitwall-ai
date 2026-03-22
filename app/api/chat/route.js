import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export async function POST(request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "API key not configured. Please set GROQ_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    // Process messages into Groq/OpenAI format
    const mappedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }))
    ];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: mappedMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      let errorMessage = "API error";
      try {
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.error?.message || errorData;
      } catch (e) {
        errorMessage = errorData;
      }
      
      console.error("Groq API error:", errorMessage);
      
      const isRateLimit = groqResponse.status === 429 || errorMessage.toLowerCase().includes("rate limit");
      if (isRateLimit) {
        return Response.json(
          { error: "Rate limit exceeded. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      
      return Response.json({ error: errorMessage }, { status: groqResponse.status });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Create a readable stream that transforms Groq SSE format (which matches OpenAI) 
    // into our frontend's expected custom SSE format {"text": "..."}
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            
            // Keep the last incomplete line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith("data: ")) {
                const dataStr = trimmedLine.slice(6);
                
                if (dataStr === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  break;
                }

                try {
                  const data = JSON.parse(dataStr);
                  const content = data.choices[0]?.delta?.content;
                  if (content) {
                    // Send it in the format our frontend expects
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
                  }
                } catch (e) {
                  // Ignore parse errors from partial chunks
                }
              }
            }
          }
          
          if (buffer.trim().length > 0) {
             // process any remaining buffer if needed
          }
          
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (streamError) {
          console.error("Stream error:", streamError.message);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error.message);
    return Response.json(
      { error: error.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
