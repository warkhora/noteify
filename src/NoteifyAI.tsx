import { useState, useRef, useEffect } from "react";
import { askGroq } from "./ai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function NoteifyAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello, I'm Noteify AI – powered by Groq. Ask me anything about your notes, ideas, or plans."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askGroq(userMsg.content);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: reply || "I’m here, but I couldn’t generate a response this time."
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div
      className="frame fade-in"
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        background: "radial-gradient(circle at top, #222 0, #050509 55%)",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.7)",
        padding: "18px 20px"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "999px",
              background:
                "conic-gradient(from 180deg, #ffd700, #4f8cff, #ff6bcb, #ffd700)",
              padding: "2px"
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "999px",
                background: "#050509",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#ffd700",
                fontWeight: 700
              }}
            >
              N
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase"
              }}
            >
              Noteify AI
            </div>
            <div
              style={{
                fontSize: "11px",
                opacity: 0.7
              }}
            >
              Powered by Groq • English only
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: "11px",
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "999px",
              background: loading ? "#ffd700" : "#3ddc84",
              boxShadow: loading
                ? "0 0 10px rgba(255,215,0,0.8)"
                : "0 0 6px rgba(61,220,132,0.8)"
            }}
          />
          <span>{loading ? "Thinking with Groq…" : "Ready for your next idea"}</span>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 4px 12px 0",
          marginTop: "4px"
        }}
      >
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "11px 13px",
                  borderRadius: isUser
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                  background: isUser
                    ? "linear-gradient(135deg, #4f8cff, #7b5cff)"
                    : "rgba(15,15,20,0.95)",
                  color: isUser ? "#fff" : "#f3f3f3",
                  fontSize: "14px",
                  lineHeight: 1.5,
                  border: isUser
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: isUser
                    ? "0 10px 25px rgba(79,140,255,0.45)"
                    : "0 10px 25px rgba(0,0,0,0.6)",
                  whiteSpace: "pre-wrap"
                }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div
            style={{
              fontSize: "12px",
              opacity: 0.7,
              fontStyle: "italic",
              marginTop: "4px"
            }}
          >
            Noteify AI is crafting a response…
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          marginTop: "10px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(10,10,15,0.95)",
          padding: "10px 10px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Noteify AI to summarize a note, rewrite text, brainstorm ideas, or plan your day..."
          style={{
            resize: "none",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#f5f5f5",
            fontSize: "14px",
            lineHeight: 1.5,
            maxHeight: "120px",
            minHeight: "50px"
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <div
            style={{
              fontSize: "11px",
              opacity: 0.6
            }}
          >
            Press <b>Enter</b> to send • <b>Shift+Enter</b> for new line
          </div>

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              border: "none",
              cursor: loading || !input.trim() ? "default" : "pointer",
              background: loading || !input.trim()
                ? "rgba(255,255,255,0.08)"
                : "linear-gradient(135deg, #ffd700, #ff9f43)",
              color: loading || !input.trim() ? "#777" : "#111",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow:
                loading || !input.trim()
                  ? "none"
                  : "0 10px 25px rgba(255,215,0,0.45)",
              transition: "transform 0.1s ease, box-shadow 0.1s ease"
            }}
          >
            {loading ? "Thinking…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
