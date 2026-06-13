import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { recordMetric } from '@/lib/analytics';
import { useI18n } from '@/lib/i18n';
import { useUiPreferences } from '@/contexts/ui-preferences';
import { usePortfolioData } from '@/data/portfolio';
import { MarkdownText } from './chat-markdown';
import { detectChatActions, ChatActions, type ChatAction } from './chat-actions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: ChatAction[];
}

export function ChatWidget() {
  const { language } = useI18n();
  const { theme } = useUiPreferences();
  const { profile } = usePortfolioData();
  const isDark = theme === 'dark';
  const suggestions = language === 'en'
    ? ['What technologies do you master?', 'Can I see your CV?', 'Show me your LinkedIn', 'Are you available for projects?']
    : ['¿Qué tecnologías dominas?', '¿Me pasas tu CV?', 'Muéstrame tu LinkedIn', '¿Estás disponible para proyectos?'];

  const welcomeMessage = language === 'en'
    ? 'Hi! I am Anthony\'s virtual assistant. I can answer questions about his experience, skills, and availability. How can I help you?'
    : '¡Hola! Soy el asistente virtual de Anthony. Puedo responderte sobre su experiencia, habilidades o disponibilidad. ¿En qué puedo ayudarte?';

  const fallbackErrorMessage = language === 'en'
    ? 'Sorry, there was an error processing your request. Please contact anthonysosa44@gmail.com directly.'
    : 'Lo siento, hubo un error al procesar tu consulta. Intenta escribir directamente a anthonysosa44@gmail.com.';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: welcomeMessage,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowLoad, setSlowLoad] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].role !== 'assistant') return prev;
      if (prev[0].content === welcomeMessage) return prev;
      return [{ role: 'assistant', content: welcomeMessage }];
    });
  }, [welcomeMessage]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    recordMetric('AI_REQUEST');

    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setSlowLoad(false);

    // If render cold-start, show warning after 7s
    slowTimerRef.current = setTimeout(() => setSlowLoad(true), 7000);

    try {
      const res = await api.post<{ reply: string }>('/chat', {
        // Enviar SOLO { role, content } y solo los ultimos 10 mensajes:
        // - `actions` no es valido en el backend (lo rechaza el ValidationPipe)
        // - el cap de 10 evita superar @ArrayMaxSize y permite chatear sin limite
        //   (el backend igual solo usa los ultimos 8 para el LLM)
        messages: newMessages
          .filter((m) => m.role !== 'assistant' || newMessages.indexOf(m) > 0)
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content })),
      });
      // Botones contextuales: detecta tanto en la pregunta como en la RESPUESTA,
      // así si la IA ofrece el CV/redes aunque no se lo pidan, el botón aparece.
      const reply = res.data.reply ?? '';
      const actions = detectChatActions(`${content}\n${reply}`, profile.links, language === 'en');
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, actions }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackErrorMessage,
        },
      ]);
    } finally {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
      setLoading(false);
      setSlowLoad(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 right-4 sm:right-6 z-50 w-[52px] h-[52px] rounded-full shadow-[var(--shadow-lg)] border flex items-center justify-center transition-all duration-300 ${
          open
            ? (isDark
              ? 'bg-slate-700 border-slate-500 hover:bg-slate-600 rotate-0'
              : 'bg-slate-700 border-slate-600 hover:bg-slate-800 rotate-0')
            : 'bg-[var(--color-primary)] border-transparent hover:bg-[var(--color-primary-dark)] hover:-translate-y-1'
        }`}
        aria-label={language === 'en' ? 'AI chat' : 'Chat con IA'}
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={20} className="text-white" />}
        {!open && (
          <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-success)] border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}>
            <span className="absolute inset-0 rounded-full bg-[var(--color-success)] animate-ping opacity-75" />
          </span>
        )}
      </button>

      {/* Panel de chat */}
      <div
        className={`fixed bottom-[92px] left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-[380px] rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] border flex flex-col transition-all duration-300 origin-bottom-right ${
          isDark ? 'bg-slate-900/95 border-slate-700/70' : 'bg-[var(--color-card)] border-[var(--color-border)]'
        } ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxHeight: '480px' }}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 p-4 border-b bg-gradient-to-r from-[var(--color-primary)] to-orange-500 rounded-t-2xl ${isDark ? 'border-slate-700/70' : 'border-[var(--color-border)]'}`}>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">{language === 'en' ? 'Anthony Assistant' : 'Asistente de Anthony'}</p>
            <p className="text-red-100 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
              {language === 'en' ? 'AI · Replies in seconds' : 'IA · Responde en segundos'}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
            aria-label={language === 'en' ? 'Close chat' : 'Cerrar chat'}
          >
            <X size={15} className="text-white" />
          </button>
        </div>

        {/* Mensajes */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-slate-900/70' : ''}`} style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant'
                  ? (isDark ? 'bg-slate-800 text-red-300' : 'bg-red-50 text-[var(--color-primary)]')
                  : (isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500')
              }`}>
                {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className={`max-w-[84%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                msg.role === 'assistant'
                  ? `${isDark ? 'bg-slate-800 border border-slate-700 text-slate-100' : 'bg-[var(--color-bg)] text-[var(--color-text)]'} rounded-tl-sm`
                  : 'bg-[var(--color-primary)] text-white rounded-tr-sm'
              }`}>
                {msg.role === 'assistant' ? <MarkdownText text={msg.content} /> : msg.content}
                {msg.role === 'assistant' && msg.actions && <ChatActions actions={msg.actions} />}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-slate-800' : 'bg-red-50'}`}>
                  <Bot size={14} className={isDark ? 'text-red-300' : 'text-[var(--color-primary)]'} />
                </div>
                <div className={`px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1.5 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-[var(--color-bg)]'}`}>
                  <Loader2 size={13} className={isDark ? 'animate-spin text-red-300' : 'animate-spin text-[var(--color-primary)]'} />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {slowLoad
                      ? (language === 'en' ? 'Waking up server (~30s)...' : 'Despertando servidor (~30s)...')
                      : (language === 'en' ? 'Thinking...' : 'Pensando...')}
                  </span>
                </div>
              </div>
              {slowLoad && (
                <p className={`text-[10px] ml-9 ${isDark ? 'text-slate-400' : 'text-[var(--color-text-muted)]'}`}>
                  {language === 'en' ? 'First request after inactivity may take a moment.' : 'Primera solicitud tras inactividad puede demorar.'}
                </p>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Sugerencias — solo si es el primer turno */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className={`text-xs px-2.5 py-1 rounded-full border text-left leading-tight transition-colors ${
                  isDark
                    ? 'border-slate-700 text-slate-200 bg-slate-800 hover:border-red-400 hover:text-red-300'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={`p-3 border-t flex gap-2 ${isDark ? 'border-slate-700/80 bg-slate-900/90' : 'border-[var(--color-border)]'}`}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={language === 'en' ? 'Type your question...' : 'Escribe tu pregunta...'}
            className={`flex-1 text-sm px-3 py-2 rounded-xl border focus:outline-none focus:border-[var(--color-primary)] ${isDark ? 'border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-400' : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]'}`}
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
