import { useState } from "react";

export default function Aiframe({ askGroq }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    setLoading(true);
    const result = await askGroq(input);
    setResponse(result);
    setLoading(false);
  }

  return (
    <div className="frame fade-in" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 className="title">Noteify AI</h1>
      <p className="subtitle">Powered by Groq</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Skriv noe du vil spørre KI-en om..."
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          background: "rgba(20,20,20,0.85)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          marginBottom: "15px"
        }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#ffd700",
          color: "black",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        {loading ? "Tenker..." : "Send til KI"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            whiteSpace: "pre-wrap"
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
}
