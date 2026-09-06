import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, Send, ArrowRight, FileText, Sparkles, Globe } from 'lucide-react';
import { ASSISTANT_QA } from '../../data/mockData';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  qa?: typeof ASSISTANT_QA[number];
  suggestedDocs?: string[];
  isAi?: boolean;
  timestamp: Date;
}

const SUGGESTIONS_BY_LANG: Record<'en' | 'hi' | 'gu', string[]> = {
  en: [
    'How do I start exporting?',
    'What documents are needed for export to Germany?',
    'How does Dak Ghar Niryat Kendra (DNK) work?',
    'How can I estimate international shipping costs?',
    'What is PBE-III and how do I file it?',
    'What should I prepare before visiting my nearest DNK?',
  ],
  hi: [
    'निर्यात कैसे शुरू करें?',
    'जर्मनी को निर्यात के लिए कौन से दस्तावेज चाहिए?',
    'डाक घर निर्यात केंद्र (DNK) कैसे काम करता है?',
    'अंतर्राष्ट्रीय शिपिंग लागत का अनुमान कैसे लगाएं?',
    'PBE-III क्या है और इसे कैसे भरें?',
    'DNK जाने से पहले क्या तैयारी करनी चाहिए?',
  ],
  gu: [
    'નિર્યાત કેવી રીતે શરૂ કરવું?',
    'જર્મનીમાં નિર્યાત કરવા ક્યા દસ્તાવેજો જોઈએ?',
    'ડાક ઘર નિર્યાત કેન્દ્ર (DNK) કેવી રીતે કામ કરે છે?',
    'આંતરરાષ્ટ્રીય શિપિંગ ખર્ચનો અંદાજ કેવી રીતે મેળવવો?',
    'PBE-III શું છે અને કેવી રીતે ફાઇલ કરવું?',
    'DNK મુલાકાત લેતાં પહેલાં શું તૈયારી કરવી?',
  ],
};

const API_BASE_URL = 'http://localhost:8000/api';

export default function Assistant() {
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSuggestions = SUGGESTIONS_BY_LANG[language] || SUGGESTIONS_BY_LANG.en;

  // Local fallback matcher
  const findAnswer = (q: string) => {
    const lower = q.toLowerCase();
    return ASSISTANT_QA.find((qa) => {
      const words = qa.question.toLowerCase().split(' ');
      return words.some((w) => w.length > 3 && lower.includes(w));
    });
  };

  const genericAnswer = (q: string): typeof ASSISTANT_QA[number] => ({
    question: q,
    answer: `I'd be happy to help with that! Here are key export steps: check the export readiness page for your score, visit the document center for required paperwork, or find your nearest DNK for hands-on packaging and customs assistance.`,
    nextSteps: ['Check Export Readiness', 'Visit Document Center', 'Find Nearest DNK'],
    requiredDocuments: ['Commercial Invoice', 'Packing List', 'Certificate of Origin'],
    actionButton: 'Go to Dashboard',
    actionLink: '/seller/dashboard',
  });

  const sendToBackendAI = async (userText: string, currentHistory: Message[], targetLang: 'en' | 'hi' | 'gu') => {
    setTyping(true);
    try {
      const formattedHistory = currentHistory.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch(`${API_BASE_URL}/assistant/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: formattedHistory,
          language: targetLang,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const msg: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'No response received from AI.',
        suggestedDocs: data.suggestedDocuments || [],
        isAi: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      console.warn('Backend AI unavailable, falling back to local assistant:', err);
      const match = findAnswer(userText);
      const qa = match ?? genericAnswer(userText);
      const msg: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: qa.answer,
        qa,
        isAi: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
    } finally {
      setTyping(false);
    }
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

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    sendToBackendAI(q, messages, language);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Format AI markdown with basic styling (bold, lists, headers)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;
          
          // Headings
          if (line.startsWith('### ')) {
            return <h4 key={idx} className="font-bold text-gray-900 text-sm mt-2">{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="font-bold text-gray-900 text-base mt-2.5">{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('# ')) {
            return <h2 key={idx} className="font-bold text-gray-900 text-lg mt-3">{line.replace('# ', '')}</h2>;
          }

          // Bullet points
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const content = line.trim().replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[var(--color-primary)] font-bold">•</span>
                <span>{formatInline(content)}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = line.trim().match(/^(\d+)[.)]\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-semibold text-gray-700 min-w-4">{numMatch[1]}.</span>
                <span>{formatInline(numMatch[2])}</span>
              </div>
            );
          }

          return <p key={idx}>{formatInline(line)}</p>;
        })}
      </div>
    );
  };

  const formatInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary)] shadow-sm">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[var(--color-primary)]">
                  {t('seller.assistant.title', language)} (Daksh)
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Groq AI Live
                </span>
              </div>
              <p className="text-xs text-gray-500">{t('seller.assistant.subtitle', language)}</p>
            </div>
          </div>

          {/* Quick Language Selector */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto border border-gray-200">
            <Globe className="h-3.5 w-3.5 text-gray-500 ml-1.5 mr-0.5" />
            {(['en', 'hi', 'gu'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === l
                    ? 'bg-white text-[var(--color-primary)] shadow-xs border border-gray-200 font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="p-4 rounded-2xl bg-blue-50 mb-4 border border-blue-100 shadow-sm">
            <Sparkles className="h-10 w-10 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {language === 'hi'
              ? 'दक्ष आपकी क्या सहायता कर सकता है?'
              : language === 'gu'
              ? 'દક્ષ તમારી શું સહાય કરી શકે છે?'
              : 'How can Daksh help you export today?'}
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            {language === 'hi'
              ? 'डाक घर निर्यात केंद्र (DNK), जरूरी दस्तावेज, कस्टम क्लीयरेंस और पैकेजिंग नियमों के बारे में पूछें।'
              : language === 'gu'
              ? 'ડાક ઘર નિર્યાત કેન્દ્ર (DNK), જરૂરી દસ્તાવેજો, કસ્ટમ ક્લિયરન્સ અને પેકેજિંગ નિયમો વિશે પૂછો.'
              : 'Ask me anything about exporting via Dak Ghar Niryat Kendra (DNK), required paperwork, customs clearance, or packaging rules.'}
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {activeSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:border-[var(--color-primary)] hover:bg-gray-50 transition-all shadow-xs text-left"
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
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}
                </div>

                <div className="flex items-center justify-between px-1 mt-1">
                  <p className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</p>
                  {msg.role === 'assistant' && msg.isAi && (
                    <span className="text-[10px] text-indigo-500 font-medium">Daksh AI</span>
                  )}
                </div>

                {msg.suggestedDocs && msg.suggestedDocs.length > 0 && (
                  <div className="mt-2 bg-blue-50/70 border border-blue-100 rounded-xl p-2.5">
                    <p className="text-xs font-semibold text-blue-900 mb-1.5">
                      {language === 'hi' ? 'संबंधित दस्तावेज:' : language === 'gu' ? 'સંબંધિત દસ્તાવેજો:' : 'Relevant Documents:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedDocs.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-blue-200 rounded-md text-xs text-blue-800 flex items-center gap-1">
                          <FileText className="h-3 w-3 text-blue-600" />
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {msg.qa && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                    {msg.qa.nextSteps.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Next Steps:</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {msg.qa.nextSteps.map((s, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <ArrowRight className="h-3 w-3 text-[var(--color-accent-amber)]" />
                              {s}
                            </li>
                          ))}
                        </ul>
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
            <div className="flex gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-gray-400 ml-2">
                    {language === 'hi' ? 'दक्ष टाइप कर रहा है...' : language === 'gu' ? 'દક્ષ ટાઇપ કરી રહ્યો છે...' : 'Daksh is typing...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mt-2 -mx-1 px-1">
          {activeSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="px-3 py-1 rounded-full border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap flex-shrink-0 shadow-xs"
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
          placeholder={
            language === 'hi'
              ? 'निर्यात या DNK के बारे में कुछ भी पूछें...'
              : language === 'gu'
              ? 'નિર્યાત અથવા DNK વિશે કંઈ પણ પૂછો...'
              : t('seller.assistant.placeholder', language)
          }
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent shadow-xs"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || typing}
          className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xs"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
