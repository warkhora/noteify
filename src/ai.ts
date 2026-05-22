export async function askGroq(prompt: string) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.error("Groq API key missing!");
    return "Error: Missing API key.";
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are Noteify AI. Always respond in clear English." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log("Groq raw:", data);

    return (
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "Groq returned no content."
    );

  } catch (err) {
    console.error("Groq error:", err);
    return "Network or server error.";
  }
}
