import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Send,
  Sparkles,
  CheckCircle2,
  FileText,
  Truck,
  Building2,
  ShieldCheck,
  ArrowRight,
  ThumbsUp,
  Bot,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { t } from '../i18n/translations';

interface FAQItem {
  id: string;
  category: 'dnk' | 'customs' | 'pricing' | 'account';
  question: string;
  answer: string;
  actionLabel?: string;
  actionLink?: string;
}

const getFaqData = (lang: string): FAQItem[] => {
  if (lang === 'gu') {
    return [
      {
        id: 'faq-1',
        category: 'dnk',
        question: 'ડાક ઘર નિર્યાત કેન્દ્ર (DNK) શું છે અને તે નિકાસકારોને કેવી રીતે મદદ કરે છે?',
        answer:
          'ડાક ઘર નિર્યાત કેન્દ્ર (DNK) એ ઈન્ડિયા પોસ્ટની એક પહેલ છે જે નિયુક્ત પોસ્ટ ઑફિસોને સંપૂર્ણ નિકાસ સુવિધા કેન્દ્રોમાં ફેરવે છે. નાના વ્યવસાયો અને ગ્રામીણ કારીગરો મોટા ફોરવર્ડર્સ વિના સીધા પાર્સલ બુક કરી શકે છે અને કસ્ટમ્સ ક્લિયરન્સ મેળવી શકે છે.',
        actionLabel: 'નજીકનું DNK શોધો',
        actionLink: '/seller/dnk',
      },
      {
        id: 'faq-2',
        category: 'customs',
        question: 'પોસ્ટલ બિલ ઓફ એક્સપોર્ટ (PBE) શું છે અને મારે કયું ફોર્મ જોઈએ?',
        answer:
          'પોસ્ટલ બિલ ઓફ એક્સપોર્ટ (PBE) એ ટપાલ નિકાસ માટે ભારતીય કસ્ટમ્સ સાથે દાખલ કરવામાં આવેલું ઇલેક્ટ્રોનિક ઘોષણાપત્ર છે. વેચાણ માટે PBE-III અને નમૂનાઓ/ભેટ માટે PBE-IV નો ઉપયોગ કરો.',
        actionLabel: 'દસ્તાવેજ કેન્દ્ર જુઓ',
        actionLink: '/seller/documents',
      },
      {
        id: 'faq-3',
        category: 'customs',
        question: 'શું DNK દ્વારા નિકાસ કરવા માટે IEC કોડ ફરજિયાત છે?',
        answer:
          'હા, વેપારી નિકાસ માટે DGFT દ્વારા જારી કરાયેલ ઇમ્પોર્ટર-એક્સપોર્ટર કોડ (IEC) ફરજિયાત છે. તમે પાન કાર્ડ અને બેંક વિગતો સાથે ઓનલાઇન 1-2 દિવસમાં IEC મેળવી શકો છો.',
        actionLabel: 'AI સહાયકને પૂછો',
        actionLink: '/seller/assistant',
      },
      {
        id: 'faq-4',
        category: 'pricing',
        question: 'આંતરરાષ્ટ્રીય શિપિંગ દરોની ગણતરી કેવી રીતે થાય છે?',
        answer:
          'શિપિંગ દર દેશ, વજન અને પાર્સલ પ્રકાર (Air Parcel, Speed Post) પર આધારિત છે. ચોક્કસ દર જાણવા માટે અમારા નિકાસ ખર્ચ કેલ્ક્યુલેટરનો ઉપયોગ કરો.',
        actionLabel: 'શિપિંગ ખર્ચ ગણો',
        actionLink: '/seller/cost-calculator',
      },
      {
        id: 'faq-5',
        category: 'dnk',
        question: 'લાકડાની અને નાજુક વસ્તુઓ માટે કેવું પેકેજિંગ જરૂરી છે?',
        answer:
          'પાર્સલ માટે 5-પ્લાય બોક્સ અને બબલ રેપ જરૂરી છે. જર્મની/EU માં લાકડાની વસ્તુઓ મોકલવા માટે ISPM-15 અથવા ફાયટોસેનિટરી પ્રમાણપત્ર જરૂરી છે.',
        actionLabel: 'તત્પરતા તપાસો',
        actionLink: '/seller/readiness',
      },
      {
        id: 'faq-6',
        category: 'pricing',
        question: 'શું ભારતમાં નિકાસ પર GST લાગે છે?',
        answer:
          'GST હેઠળ નિકાસ "Zero-Rated" છે. તમે GST પોર્ટલ પર LUT ફાઇલ કરીને 0% GST પર નિકાસ કરી શકો છો અથવા રિફંડ મેળવી શકો છો.',
        actionLabel: 'સહાયકને પૂછો',
        actionLink: '/seller/assistant',
      },
      {
        id: 'faq-7',
        category: 'account',
        question: 'નિર્યાત સાથી ગ્રામીણ કારીગરોને કેવી રીતે મદદ કરે છે?',
        answer:
          'નિર્યાત સાથી કારીગરોને વૈશ્વિક ગ્રાહકો સાથે સીધા જોડે છે અને સ્થાનિક પોસ્ટ ઑફિસ દ્વારા સરળ નિકાસ સુવિધા પૂરી પાડે છે.',
        actionLabel: 'બજાર જુઓ',
        actionLink: '/marketplace',
      },
    ];
  }

  if (lang === 'hi') {
    return [
      {
        id: 'faq-1',
        category: 'dnk',
        question: 'डाक घर निर्यात केंद्र (DNK) क्या है और यह निर्यातकों की कैसे मदद करता है?',
        answer:
          'डाक घर निर्यात केंद्र (DNK) इंडिया पोस्ट की एक पहल है जो डाकघरों को निर्यात सुविधा केंद्रों में बदलती है। छोटे व्यवसायी और कारीगर बिना बड़े फ्रेट फारवर्डर के सीधे पार्सल बुक और सीमा शुल्क निकासी कर सकते हैं।',
        actionLabel: 'निकटतम DNK खोजें',
        actionLink: '/seller/dnk',
      },
      {
        id: 'faq-2',
        category: 'customs',
        question: 'पोस्टल बिल ऑफ एक्सपोर्ट (PBE) क्या है और मुझे कौन सा फॉर्म चाहिए?',
        answer:
          'पोस्टल बिल ऑफ एक्सपोर्ट (PBE) डाक निर्यात के लिए भारतीय सीमा शुल्क का इलेक्ट्रॉनिक घोषणा पत्र है। व्यावसायिक शिपमेंट के लिए PBE-III और मुफ्त नमूनों के लिए PBE-IV का उपयोग करें।',
        actionLabel: 'दस्तावेज़ केंद्र देखें',
        actionLink: '/seller/documents',
      },
      {
        id: 'faq-3',
        category: 'customs',
        question: 'क्या DNK से निर्यात के लिए IEC कोड अनिवार्य है?',
        answer:
          'हाँ, व्यावसायिक निर्यात के लिए DGFT द्वारा जारी IEC कोड अनिवार्य है। आप पैन और बैंक विवरण के साथ 1-2 कार्य दिवसों में ऑनलाइन आवेदन कर सकते हैं।',
        actionLabel: 'AI सहायक से पूछें',
        actionLink: '/seller/assistant',
      },
      {
        id: 'faq-4',
        category: 'pricing',
        question: 'अंतर्राष्ट्रीय शिपिंग दरों की गणना कैसे की जाती है?',
        answer:
          'दरें गंतव्य देश, वजन और पार्सल प्रकार (Air Parcel, EMS Speed Post) पर निर्भर करती हैं। रीयल-टाइम अनुमान के लिए हमारे लागत कैल्कुलेटर का उपयोग करें।',
        actionLabel: 'शिपिंग लागत की गणना करें',
        actionLink: '/seller/cost-calculator',
      },
      {
        id: 'faq-5',
        category: 'dnk',
        question: 'नाज़ुक या लकड़ी की वस्तुओं के लिए क्या पैकेजिंग मानक हैं?',
        answer:
          'पार्सल में 5-प्लाई नालीदार बक्से और बबल रैप होना चाहिए। जर्मनी/यूरोपीय संघ में लकड़ी के हस्तशिल्प के लिए ISPM-15 या पादप स्वच्छता प्रमाणन आवश्यक है।',
        actionLabel: 'निर्यात तत्परता जाँचें',
        actionLink: '/seller/readiness',
      },
      {
        id: 'faq-6',
        category: 'pricing',
        question: 'क्या भारत में निर्यात पर GST लागू होता है?',
        answer:
          'GST के तहत निर्यात "Zero-Rated" है। आप LUT दाखिल करके शून्य GST पर निर्यात कर सकते हैं या IGST भुगतान कर पूर्ण रिफंड का दावा कर सकते हैं।',
        actionLabel: 'दक्ष सहायक से पूछें',
        actionLink: '/seller/assistant',
      },
      {
        id: 'faq-7',
        category: 'account',
        question: 'Niryat Saathi ग्रामीण कारीगरों की कैसे रक्षा करता है?',
        answer:
          'Niryat Saathi भारतीय कारीगरों को वैश्विक खरीदारों से सीधे जोड़ता है और डाकघरों पर निर्यात सहायता प्रदान करता है।',
        actionLabel: 'मार्केटप्लेस देखें',
        actionLink: '/marketplace',
      },
    ];
  }

  return [
    {
      id: 'faq-1',
      category: 'dnk',
      question: 'What is Dak Ghar Niryat Kendra (DNK) and how does it help exporters?',
      answer:
        'Dak Ghar Niryat Kendra (DNK) is an initiative by India Post that transforms designated post offices into full-fledged export facilitation hubs. Small businesses, rural artisans, and MSMEs can book commercial parcels, receive packaging assistance, and complete postal export customs clearance without needing large freight forwarders.',
      actionLabel: 'Find Nearest DNK',
      actionLink: '/seller/dnk',
    },
    {
      id: 'faq-2',
      category: 'customs',
      question: 'What is a Postal Bill of Export (PBE) and which form do I need?',
      answer:
        'A Postal Bill of Export (PBE) is the official electronic declaration filed with Indian Customs for postal exports. Use PBE-III for commercial shipments (goods intended for sale) and PBE-IV for free samples or gifts.',
      actionLabel: 'View Document Center',
      actionLink: '/seller/documents',
    },
    {
      id: 'faq-3',
      category: 'customs',
      question: 'Do I need an Import-Export Code (IEC) to export via DNK?',
      answer:
        'Yes, an Importer-Exporter Code (IEC) issued by the Directorate General of Foreign Trade (DGFT) is mandatory for commercial exports. You can apply for an IEC online in 1–2 working days using your PAN and bank details.',
      actionLabel: 'Ask AI Assistant',
      actionLink: '/seller/assistant',
    },
    {
      id: 'faq-4',
      category: 'pricing',
      question: 'How are international postal shipping rates calculated?',
      answer:
        'Shipping rates depend on the destination country, chargeable weight (physical vs volumetric weight), and parcel type (Air Parcel, EMS Speed Post International, or Tracked Packet). Use our built-in Export Cost Calculator to get real-time price estimates.',
      actionLabel: 'Calculate Shipping Cost',
      actionLink: '/seller/cost-calculator',
    },
    {
      id: 'faq-5',
      category: 'dnk',
      question: 'What packaging standards are required for fragile or wooden items?',
      answer:
        'Parcels must use 5-ply or 7-ply corrugated boxes, interior bubble wrap / thermocol padding, and clear fragile labels. Wooden handicrafts exported to countries like Germany/EU require phytosanitary certification or ISPM-15 treatment.',
      actionLabel: 'Check Export Readiness',
      actionLink: '/seller/readiness',
    },
    {
      id: 'faq-6',
      category: 'pricing',
      question: 'Are exports subject to GST in India?',
      answer:
        'Exports are treated as "Zero-Rated Supplies" under GST. You can export with zero GST payment by filing a Letter of Undertaking (LUT) on the GST portal, or export with IGST payment and claim full refund.',
      actionLabel: 'Ask Daksh Assistant',
      actionLink: '/seller/assistant',
    },
    {
      id: 'faq-7',
      category: 'account',
      question: 'How does Niryat Saathi protect rural artisans and ensure fair trade?',
      answer:
        'Niryat Saathi connects Indian artisans directly with global buyers on our verified marketplace, eliminating intermediaries and providing assisted export workflows at local post offices.',
      actionLabel: 'Explore Marketplace',
      actionLink: '/marketplace',
    },
  ];
};

const API_BASE_URL = 'http://localhost:8000/api';

export default function FAQFeedback() {
  const user = useAuthStore((s) => s.user);
  const language = useAppStore((s) => s.language);
  const addToast = useAppStore((s) => s.addToast);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  // Feedback Form State
  const [rating, setRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Platform Experience');
  const [feedbackName, setFeedbackName] = useState(user?.name ?? '');
  const [feedbackEmail, setFeedbackEmail] = useState(user?.email ?? '');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs = useMemo(() => getFaqData(language), [language]);

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: t('faq.categoryAll', language) },
    { id: 'dnk', label: t('faq.categoryDNK', language) },
    { id: 'customs', label: t('faq.categoryCustoms', language) },
    { id: 'pricing', label: t('faq.categoryPricing', language) },
    { id: 'account', label: t('faq.categoryAccount', language) },
  ];

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      addToast({ type: 'warning', message: 'Please write your feedback message.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: user?.id || 'ANONYMOUS',
        userName: feedbackName || 'Anonymous User',
        userEmail: feedbackEmail || 'anonymous@example.com',
        userRole: user?.role || 'visitor',
        rating,
        category: feedbackCategory,
        message: feedbackMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      await fetch(`${API_BASE_URL}/feedback/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      addToast({
        type: 'success',
        message: t('faq.thankYou', language),
      });
      setFeedbackMessage('');
    } catch {
      setSubmitted(true);
      addToast({
        type: 'success',
        message: t('faq.thankYou', language),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-gray-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15 backdrop-blur-xs mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            {t('nav.faqFeedback', language)}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('faq.title', language)}
          </h1>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            {t('faq.subtitle', language)}
          </p>

          {/* Search Box */}
          <div className="relative mt-6 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('faq.searchPlaceholder', language)}
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md"
            />
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: FAQ Accordion */}
        <div className="lg:col-span-2 space-y-5">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
                <HelpCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">No matching questions found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search keyword or ask our AI assistant.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs transition-all overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-100 space-y-3 leading-relaxed animate-fade-in">
                        <p>{faq.answer}</p>
                        {faq.actionLabel && faq.actionLink && (
                          <div className="pt-1">
                            <Link
                              to={faq.actionLink}
                              className="inline-flex items-center gap-1.5 font-bold text-xs text-[var(--color-primary)] hover:underline"
                            >
                              {faq.actionLabel} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick AI Assistant Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-[var(--color-primary)] text-white rounded-xl shadow-xs">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {language === 'gu' ? 'કોઈ ચોક્કસ નિકાસ પ્રશ્ન છે?' : language === 'hi' ? 'कोई विशिष्ट निर्यात प्रश्न है?' : 'Have a specific export question?'}
                </h4>
                <p className="text-xs text-gray-600">
                  {language === 'gu' ? 'દક્ષને પૂછો, અમારા બહુભાષી AI સહાયક.' : language === 'hi' ? 'दक्ष से पूछें, हमारे बहुभाषी AI सहायक।' : 'Ask Daksh, our multilingual AI assistant trained on India Post DNK guidelines.'}
                </p>
              </div>
            </div>

            <Link
              to="/seller/assistant"
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-gray-800 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5"
            >
              {language === 'gu' ? 'દક્ષને પૂછો' : language === 'hi' ? 'दक्ष से पूछें' : 'Ask Daksh'} <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Right Col: Feedback Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-red-50 text-[var(--color-brand-red)]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{t('faq.feedbackTitle', language)}</h3>
                <p className="text-[11px] text-gray-500">{t('faq.feedbackDesc', language)}</p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3 animate-fade-in">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">{t('faq.thankYou', language)}</h4>
                <p className="text-xs text-gray-600">
                  {t('faq.thankYouDesc', language)}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  {t('faq.submitAnother', language)}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5 mt-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    {t('faq.yourRating', language)}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-2">
                      {rating} / 5 {t('faq.stars', language)}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('faq.feedbackTopic', language)}
                  </label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="Platform Experience">Platform Experience</option>
                    <option value="DNK Post Office Service">DNK Post Office Service</option>
                    <option value="Export Documentation">Export Documentation</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report / Issue">Bug Report / Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('faq.yourName', language)}
                  </label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('faq.yourMessage', language)} *
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder={
                      language === 'gu'
                        ? 'તમારો પ્રતિસાદ અથવા સૂચન અહીં લખો...'
                        : language === 'hi'
                        ? 'अपनी प्रतिक्रिया या सुझाव यहाँ लिखें...'
                        : 'Tell us what you liked or what we can do better...'
                    }
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-gray-800 transition-all shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      {t('faq.submitFeedback', language)}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
