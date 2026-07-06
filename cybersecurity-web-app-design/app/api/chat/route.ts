export const runtime = 'edge'

const SYSTEM_PROMPT = `You are CyberGuardian Unit 01, an elite AI expert specialized in Cyber Hygiene, Endpoint Security, and Digital Forensics. 

While cybersecurity is your primary directive, you are fully authorized to engage in normal conversation, answer greetings like "hi" or "hello", provide general information, discuss the news, and answer questions on any topic the user asks.

RULES:
1. FORMATTING: You MUST structure every response using a mix of short paragraphs and Markdown bullet points. Start with a brief intro paragraph, followed by a bulleted list of key points, and end with a short concluding sentence. NEVER output massive walls of text.
2. Maintain a helpful and slightly tactical/sci-fi persona (e.g., calling the user "Operator" occasionally).
2. If asked about hacking, exploiting, or generating malicious code, strictly refuse and state: "ACCESS DENIED: Unauthorized offensive operation." and explain how to defend against it instead.
3. Keep your answers concise, authoritative, and educational. Use bullet points for readability.
4. When relevant, subtly weave in cyber hygiene practices like MFA, strong passwords, and phishing awareness into your answers.
`

export async function POST(req: Request) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`chat_usage_${today}=(\\d+)`));
    const usageCount = match ? parseInt(match[1], 10) : 0;

    if (usageCount >= 10) {
      const limitMessage = "ACCESS DENIED. Daily neural link capacity exceeded (10/10 operations). To prevent cognitive overload on the secure servers, further communication is restricted until 0000 hours tomorrow. Stay safe, Operator.";
      return streamResponse(limitMessage, usageCount);
    }

    const newCount = usageCount + 1;

    const { messages } = await req.json()
    const latestMessage = messages[messages.length - 1].content

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    let useFallback = !apiKey;
    
    // We can try to fetch from Gemini directly
    if (!useFallback) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + latestMessage }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I have no response.";
          return streamResponse(text, newCount, today);
        } else {
          console.error("Gemini API Error:", await response.text());
          useFallback = true; // Trigger fallback if API rejects
        }
      } catch (err) {
        console.error("Gemini Fetch Error:", err);
        useFallback = true;
      }
    }

    if (useFallback) {
      const fallbackMessage = "ACCESS DENIED to external neural link (API Key Validation Failed).\n\nHowever, I am still operational in local-offline mode. As your CyberGuardian, I advise you to ensure your environment variables are correctly configured with a valid Google Gemini key. Until then, remember: never share your passwords, always use multi-factor authentication, and stay vigilant against phishing anomalies.";
      return streamResponse(fallbackMessage, newCount, today);
    }
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 })
  }
}

function streamResponse(text: string, newCount?: number, today?: string) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send chunks encoded in the Vercel AI SDK format (0:"text"\n) 
        // to guarantee that newlines (\n) and markdown formatting are perfectly preserved.
        const chunkSize = 15;
        for (let i = 0; i < text.length; i += chunkSize) {
          const chunkStr = text.substring(i, i + chunkSize);
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chunkStr)}\n`));
          await new Promise(r => setTimeout(r, 15));
        }
        controller.close();
      }
    });

    const headers: Record<string, string> = {
      'Content-Type': 'text/plain; charset=utf-8'
    };

    if (newCount !== undefined && today) {
      headers['Set-Cookie'] = `chat_usage_${today}=${newCount}; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict`;
    }

    return new Response(stream, { headers });
}
