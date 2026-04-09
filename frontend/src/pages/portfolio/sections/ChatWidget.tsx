import { useState, useRef, useEffect, Fragment } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

function MarkdownText({ text }: { text: string }) {
  // Split into lines and group consecutive bullet lines into lists
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let bulletGroup: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bulletGroup.length === 0) return;
    elements.push(
      <ul key={key++} className="list-disc list-outside pl-4 space-y-0.5 my-1">
        {bulletGroup.map((b, i) => (
          <li key={i}><InlineText text={b} /></li>
        ))}
      </ul>
    );
    bulletGroup = [];
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      bulletGroup.push(bulletMatch[1]);
    } else {
      flushBullets();
      if (line.trim() === '') {
        elements.push(<br key={key++} />);
      } else {
        elements.push(<p key={key++} className="my-0.5"><InlineText text={line} /></p>);
      }
    }
  }
  flushBullets();

  return <>{elements}</>;
}

function InlineText({ text }: { text: string }) {
  // Handle **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  '¿Qué tecnologías dominas?',
  '¿Cuál es tu experiencia laboral?',
  '¿Estás disponible para proyectos?',
  '¿Cómo contactarte?',
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! 👋 Soy el asistente virtual de Anthony. Puedo responderte sobre su experiencia, habilidades o disponibilidad. ¿En qué puedo ayudarte?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post<{ reply: string }>('/chat', {
        messages: newMessages.filter((m) => m.role !== 'assistant' || newMessages.indexOf(m) > 0),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, hubo un error al procesar tu consulta. Intenta escribir directamente a anthonysosa44@gmail.com' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 right-6 z-50 w-13 h-13 w-[52px] h-[52px] rounded-full shadow-[var(--shadow-lg)] flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-slate-700 hover:bg-slate-800 rotate-0'
            : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] hover:-translate-y-1'
        }`}
        aria-label="Chat con IA"
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={20} className="text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-success)] border-2 border-white">
            <span className="absolute inset-0 rounded-full bg-[var(--color-success)] animate-ping opacity-75" />
          </span>
        )}
      </button>

      {/* Panel de chat */}
      <div
        className={`fixed bottom-[92px] right-6 z-50 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] border border-[var(--color-border)] flex flex-col transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxHeight: '480px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)] to-blue-500 rounded-t-2xl">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">Asistente de Anthony</p>
            <p className="text-blue-100 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
              IA · Responde en segundos
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
            aria-label="Cerrar chat"
          >
            <X size={15} className="text-white" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-blue-50 text-[var(--color-primary)]' : 'bg-slate-100 text-slate-500'
              }`}>
                {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-[var(--color-bg)] text-[var(--color-text)] rounded-tl-sm'
                  : 'bg-[var(--color-primary)] text-white rounded-tr-sm'
              }`}>
                {msg.role === 'assistant' ? <MarkdownText text={msg.content} /> : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-[var(--color-primary)]" />
              </div>
              <div className="bg-[var(--color-bg)] px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin text-[var(--color-primary)]" />
                <span className="text-xs text-[var(--color-text-muted)]">Pensando...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Sugerencias — solo si es el primer turno */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors bg-white"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-[var(--color-border)] flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
