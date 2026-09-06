// API Client for Niryat Saathi Mobile App connecting to Django Backend
import { Platform } from 'react-native';

export function getApiBaseUrl(): string {
  // If running in browser (Expo Web)
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:8000/api`;
  }
  // Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  // iOS Simulator or default
  return 'http://localhost:8000/api';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  language: string;
  suggestedDocuments?: string[];
  status: string;
}

export async function sendAIChat(
  message: string,
  history: ChatMessage[] = [],
  language: 'en' | 'hi' | 'gu' = 'en'
): Promise<ChatResponse> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/assistant/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        language,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Backend chat failed, using fallback response:', error);
    
    // Offline / Local fallback response
    let fallbackReply = '';
    if (language === 'hi') {
      fallbackReply = `नमस्ते! डाक घर निर्यात केंद्र (DNK) के माध्यम से निर्यात करने के लिए आपको निम्नलिखित मुख्य दस्तावेजों की आवश्यकता है:\n\n1. DGFT से IEC कोड\n2. कमर्शियल इनवॉइस एवं पैकिंग लिस्ट\n3. पोस्टल बिल ऑफ एक्सपोर्ट (PBE-III)\n4. GST / LUT फाइलिंग।\n\nआप अपने नजदीकी डाकघर से सहायता प्राप्त कर सकते हैं।`;
    } else if (language === 'gu') {
      fallbackReply = `નમસ્તે! ડાક ઘર નિર્યાત કેન્દ્ર (DNK) દ્વારા એક્સપોર્ટ કરવા માટે જરૂરી મુખ્ય દસ્તાવેજો:\n\n૧. DGFT તરફથી IEC કોડ\n૨. કમર્શિયલ ઇન્વૉઇસ અને પેકિંગ લિસ્ટ\n૩. પોસ્ટલ બિલ ઑફ એક્સપોર્ટ (PBE-III)\n૪. GST / LUT ફાઇલિંગ.\n\nતમે તમારા નજીકના પોસ્ટ ઑફિસ કેન્દ્રથી સહાય મેળવી શકો છો.`;
    } else {
      fallbackReply = `Welcome to Daksh AI Assistant!\n\nTo export through Dak Ghar Niryat Kendra (DNK):\n1. Obtain an Importer-Exporter Code (IEC) from DGFT.\n2. Prepare your Commercial Invoice and Packing List.\n3. File Postal Bill of Export (PBE-III for commercial parcels).\n4. Drop your parcel at the nearest Gujarat DNK counter for international EMS dispatch.`;
    }

    return {
      reply: fallbackReply,
      language,
      status: 'fallback',
      suggestedDocuments: ['Commercial Invoice', 'Packing List', 'PBE-III', 'Certificate of Origin'],
    };
  }
}
