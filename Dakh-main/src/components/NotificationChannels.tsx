import { useState } from 'react';
import { MessageSquare, Smartphone, Check } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface Props {
  recipientName: string;
  recipientPhone: string;
  messageType: string;
}

export default function NotificationChannels({ recipientName, recipientPhone, messageType }: Props) {
  const { addToast } = useAppStore();
  const [sent, setSent] = useState<{ whatsapp: boolean; sms: boolean }>({ whatsapp: false, sms: false });

  const handleSendWhatsApp = () => {
    setSent(s => ({ ...s, whatsapp: true }));
    addToast({ type: 'success', message: `WhatsApp notification sent to ${recipientName}` });
    setTimeout(() => setSent(s => ({ ...s, whatsapp: false })), 3000);
  };

  const handleSendSMS = () => {
    setSent(s => ({ ...s, sms: true }));
    addToast({ type: 'success', message: `SMS notification sent to ${recipientPhone}` });
    setTimeout(() => setSent(s => ({ ...s, sms: false })), 3000);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleSendWhatsApp}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
      >
        {sent.whatsapp ? <Check className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
        {sent.whatsapp ? 'Sent' : 'WhatsApp'}
      </button>
      <button
        onClick={handleSendSMS}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        {sent.sms ? <Check className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
        {sent.sms ? 'Sent' : 'SMS'}
      </button>
    </div>
  );
}
