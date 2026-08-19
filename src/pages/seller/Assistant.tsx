import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, Send, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { ASSISTANT_QA } from '../../data/mockData';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  qa?: typeof ASSISTANT_QA[number];
  timestamp: Date;
}

const SUGGESTIONS = [
  'How do I start exporting?',
  'What documents are needed?',
  'Where is my nearest DNK?',
  'How can I estimate shipping cost?',
  'What is DNK?',
  'What should I prepare before visiting DNK?',
];

export default function Assistant() {
  const { language } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const findAnswer = (q: string) => {
    const lower = q.toLowerCase();
    return ASSISTANT_QA.find((qa) => {
      const words = qa.question.toLowerCase().split(' ');
      return words.some((w) => w.length > 3 && lower.includes(w));
    });
  };

  const genericAnswer = (q: string): typeof ASSISTANT_QA[number] => ({
    question: q,
    answer: `I'd be happy to help with that! While I don't have a specific answer for this question, here are some things you can do: check the export readiness page for your score, visit the document center for required paperwork, or find your nearest DNK for hands-on assistance.`,
    nextSteps: ['Check Export Readiness', 'Visit Document Center', 'Find Nearest DNK'],
    requiredDocuments: [],
    actionButton: 'Go to Dashboard',
    actionLink: '/seller/dashboard',
  });

  const addAssistantMessage = (userText: string) => {
    setTyping(true);
    setTimeout(() => {
      const match = findAnswer(userText);
      const qa = match ?? genericAnswer(userText);
      const msg: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: qa.answer,
        qa,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSend = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: q,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    addAssistantMessage(q);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary)]">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-primary)]">{t('seller.assistant.title', language)}</h2>
            <p className="text-sm text-gray-500">{t('seller.assistant.subtitle', language)}</p>
          </div>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="p-4 rounded-2xl bg-blue-50 mb-4">
            <Sparkles className="h-10 w-10 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">How can I help you export today?</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            Ask me anything about exporting — from documentation to shipping, DNK centers, or compliance rules.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-[var(--color-soft-gray)] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
                      : 'bg-[var(--color-soft-gray)] text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 px-1">{formatTime(msg.timestamp)}</p>

                {msg.qa && (
                  <div className="mt-2 bg-white border border-gray-100 rounded-xl p-3 space-y-2">
                    {msg.qa.nextSteps.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Next Steps:</p>
                        <ul className="text-xs text-gray-500 space-y-0.5">
                          {msg.qa.nextSteps.map((s, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <ArrowRight className="h-3 w-3 text-[var(--color-accent-amber)]" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {msg.qa.requiredDocuments.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Required Documents:</p>
                        <div className="flex flex-wrap gap-1">
                          {msg.qa.requiredDocuments.map((d, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[var(--color-soft-gray)] rounded text-xs text-gray-600 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {msg.qa.actionButton && msg.qa.actionLink && (
                      <Link
                        to={msg.qa.actionLink}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline mt-1"
                      >
                        {msg.qa.actionButton} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-[var(--color-soft-gray)] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mt-2 -mx-1 px-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-[var(--color-soft-gray)] transition-colors whitespace-nowrap flex-shrink-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('seller.assistant.placeholder', language)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
