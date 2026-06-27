import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader } from "lucide-react";

const GREETING = "I'm Jai. Ask me about designs, materials, process or commissions.";
const CONVO_CAP = 20; // max questions per conversation before directing to email

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const show = () => setModalOpen(true);
    const hide = () => { setModalOpen(false); setOpen(false); };
    window.addEventListener("gallery-modal-open", show);
    window.addEventListener("gallery-modal-close", hide);
    return () => {
      window.removeEventListener("gallery-modal-open", show);
      window.removeEventListener("gallery-modal-close", hide);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (messages.filter(m => m.role === "user").length >= CONVO_CAP) return;

    const userMessage = { role: "user", content: text };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter(m => m.role !== "assistant" || m.content !== GREETING),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again or contact us directly at james@rogetjames.com." }]);
        return;
      }
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again or contact us directly at james@rogetjames.com." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const closeChat = () => {
    const userMessages = messages.filter(m => m.role === "user");
    if (userMessages.length > 0) {
      fetch("/api/chat-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }).catch(() => {});
    }
    setOpen(false);
  };

  const capped = messages.filter(m => m.role === "user").length >= CONVO_CAP;

  return (
    <>
      {/* Chat panel */}
      <div
        className="fixed bottom-20 left-6 z-[95] w-[340px] max-w-[calc(100vw-3rem)] flex flex-col rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-400"
        style={{
          background: "rgba(5,5,5,0.92)",
          backdropFilter: "blur(20px)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          pointerEvents: open ? "auto" : "none",
          maxHeight: "70vh",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-clay/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-clay block" />
            </div>
            <div>
              <p className="font-heading font-semibold text-cream/80 text-sm leading-none">Jai</p>
              <p className="font-detail text-[10px] text-warm-gray/60 uppercase tracking-wider mt-0.5">ROGETjames</p>
            </div>
          </div>
          <button onClick={closeChat} className="text-warm-gray/40 hover:text-cream/60 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: "calc(70vh - 130px)" }} data-lenis-prevent>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-clay/80 text-cream rounded-br-sm"
                    : "bg-white/6 text-cream/75 rounded-bl-sm border border-white/8"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/6 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input — replaced by an email hand-off once the conversation cap is reached */}
        {capped ? (
          <div className="px-4 py-4 border-t border-white/10 text-center">
            <p className="font-detail text-xs text-warm-gray/70 leading-relaxed">
              Thanks for chatting. For anything more, email{" "}
              <a href="mailto:james@rogetjames.com" className="text-clay hover:text-clay-light underline underline-offset-2">james@rogetjames.com</a>.
            </p>
          </div>
        ) : (
          <div className="px-4 py-3 border-t border-white/10 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about designs, materials, process…"
              rows={1}
              className="flex-1 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-cream/80 text-sm placeholder:text-warm-gray/30 focus:outline-none focus:border-clay/30 resize-none leading-snug"
              style={{ maxHeight: "80px" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-clay flex items-center justify-center text-cream flex-shrink-0 disabled:opacity-30 hover:bg-clay-light transition-colors duration-200"
            >
              {loading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => open ? closeChat() : setOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-6 left-6 z-[95] flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
        style={{
          background: open ? "#9E7134" : "transparent",
          color: open ? "#EDE8DF" : "rgba(237,232,223,0.6)",
          border: "1.5px solid rgba(158, 113, 52,0.4)",
          boxShadow: open ? "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 20px rgba(158, 113, 52,0.3)" : "none",
          opacity: modalOpen ? 0 : 1,
          pointerEvents: modalOpen ? "none" : "auto",
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.borderColor = "#9E7134";
            e.currentTarget.style.color = "#EDE8DF";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 20px rgba(158, 113, 52,0.35)";
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.borderColor = "rgba(158, 113, 52,0.4)";
            e.currentTarget.style.color = "rgba(237,232,223,0.6)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        {open ? <X size={16} /> : <MessageCircle size={16} />}
        <span>{open ? "Close" : "Q & Ai"}</span>
      </button>
    </>
  );
}
