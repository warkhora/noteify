import { useState } from "react";
import { askGroq } from "../ai";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hei Josef! Hva vil du snakke om i dag?" }
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const reply = await askGroq(input);

    const assistantMessage = { role: "assistant", content: reply };
    setMessages(prev => [...prev, assistantMessage]);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Noteify KI Chat</h2>

      <div style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        height: "400px",
        overflowY: "auto",
        marginBottom: "10px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === "user" ? "right" : "left",
            margin: "10px 0"
          }}>
            <div style={{
              display: "inline-block",
              padding: "10px",
              borderRadius: "10px",
              background: msg.role === "user" ? "#4f8cff" : "#e5e5e5",
              color: msg.role === "user" ? "white" : "black",
              maxWidth: "80%"
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Skriv en melding..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
