"""
AI Assistant views using Groq LLM API with full multilingual support (English, Hindi, Gujarati).
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from groq import Groq
import logging
import re

logger = logging.getLogger(__name__)

BASE_SYSTEM_PROMPT = """You are 'Daksh' (Niryat Saathi Assistant), an intelligent and friendly AI expert designed for Indian artisans, MSMEs, SHGs, and sellers utilizing Dak Ghar Niryat Kendra (DNK) and India Post to export goods worldwide.

Your Core Knowledge & Mission:
1. Explain how Dak Ghar Niryat Kendra (DNK) works: local post offices enabled with export booking, documentation assistance, customs integration, packaging support, and international parcel logistics.
2. Guide users on mandatory export documentation:
   - Importer-Exporter Code (IEC) from DGFT
   - Commercial Invoice & Packing List
   - Certificate of Origin (CoO)
   - Postal Bill of Export (PBE-III for commercial / PBE-IV for sample)
   - Customs Declarations (CN22 / CN23)
   - GST / LUT filing for zero-rated export
   - Category-specific licenses (e.g. FSSAI for food, Handicraft Board registration, Phytosanitary certificates for wood/plants, Hallmarking for jewellery).
3. Provide country-specific export regulations (USA, Germany, UK, UAE, Japan, France, Australia, Canada, Singapore).
4. Explain HS Codes, packaging best practices (bubble wrap, corrugated boxes, wooden crates, fragile labeling), and tracking.
5. Offer step-by-step actionable advice with clear formatting, bullet points, and tables.
"""

def detect_script(text: str) -> str:
    """Detect if text contains Gujarati or Devanagari characters."""
    if re.search(r'[\u0A80-\u0AFF]', text):
        return 'gu'
    if re.search(r'[\u0900-\u097F]', text):
        return 'hi'
    return 'en'


class AIChatView(APIView):
    """
    POST /api/assistant/chat/
    Body:
    {
      "message": "...",
      "history": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}],
      "language": "en" | "hi" | "gu"
    }
    """
    def post(self, request):
        user_message = request.data.get('message', '').strip()
        history = request.data.get('history', [])
        language = request.data.get('language', 'en')

        if not user_message:
            return Response({'error': 'Message cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.GROQ_API_KEY:
            return Response({'error': 'GROQ_API_KEY is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Detect script from user input if language was default 'en' but text is in Hindi/Gujarati
        detected = detect_script(user_message)
        if detected in ['hi', 'gu'] and language == 'en':
            language = detected

        try:
            client = Groq(api_key=settings.GROQ_API_KEY)

            # Strict language enforcement prompt
            if language == 'hi':
                lang_rule = (
                    "\n\nCRITICAL LANGUAGE REQUIREMENT:\n"
                    "You MUST reply 100% in HINDI (हिन्दी - देवनागरी लिपि). "
                    "All explanations, headings, and bullet points MUST be in pure, easy-to-understand Hindi. "
                    "Do NOT reply in English. (You may keep technical acronyms like IEC, GST, DNK, PBE in Latin/English)."
                )
            elif language == 'gu':
                lang_rule = (
                    "\n\nCRITICAL LANGUAGE REQUIREMENT:\n"
                    "You MUST reply 100% in GUJARATI (ગુજરાતી લિપિ). "
                    "All explanations, headings, and bullet points MUST be in pure, fluent, natural Gujarati script. "
                    "Do NOT reply in English. (You may keep technical acronyms like IEC, GST, DNK, PBE in Latin/English)."
                )
            else:
                lang_rule = (
                    "\n\nCRITICAL LANGUAGE REQUIREMENT:\n"
                    "Reply in clear, structured English with friendly and professional formatting."
                )

            messages = [
                {"role": "system", "content": BASE_SYSTEM_PROMPT + lang_rule}
            ]

            # Append recent history
            for msg in history[-6:]:
                if msg.get('role') in ['user', 'assistant'] and msg.get('content'):
                    messages.append({
                        "role": msg['role'],
                        "content": str(msg['content'])
                    })

            messages.append({"role": "user", "content": user_message})

            model_to_use = settings.GROQ_MODEL or 'openai/gpt-oss-120b'
            chat_completion = client.chat.completions.create(
                messages=messages,
                model=model_to_use,
                temperature=0.6,
                max_tokens=900,
            )

            assistant_reply = chat_completion.choices[0].message.content

            # Analyze for suggested actions & documents
            suggested_docs = []
            lower_msg = user_message.lower()
            if any(k in lower_msg for k in ['doc', 'paper', 'certificate', 'invoice', 'દસ્તાવેજ', 'કાગળ', 'दस्तावेज']):
                if language == 'hi':
                    suggested_docs = ['कमर्शियल इनवॉइस (Commercial Invoice)', 'पैकिंग लिस्ट (Packing List)', 'सर्टिफिकेट ऑफ ओरिजिन (CoO)', 'IEC प्रमाण पत्र']
                elif language == 'gu':
                    suggested_docs = ['કમર્શિયલ ઇન્વૉઇસ (Commercial Invoice)', 'પેકિંગ લિસ્ટ (Packing List)', 'સર્ટિફિકેટ ઑફ ઓરિજિન (CoO)', 'IEC સર્ટિફિકેટ']
                else:
                    suggested_docs = ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'IEC Certificate']

            return Response({
                'reply': assistant_reply,
                'model': model_to_use,
                'language': language,
                'suggestedDocuments': suggested_docs,
                'status': 'success'
            })

        except Exception as e:
            logger.exception("Error communicating with Groq API")
            return Response({
                'error': str(e),
                'status': 'error',
                'reply': "I apologize, but I am having trouble connecting to the AI service right now. Please try again."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AIHealthView(APIView):
    """
    GET /api/assistant/health/
    """
    def get(self, request):
        return Response({
            'status': 'healthy',
            'configured_model': settings.GROQ_MODEL,
            'api_key_set': bool(settings.GROQ_API_KEY)
        })
