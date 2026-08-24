import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/common/Button.js';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string>('rajesh');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'seller', text: 'Hello! I noticed your inquiry regarding the Mikuni VM20 carburetor.', time: '10:15 AM' },
    { sender: 'me', text: 'Hi Rajesh! Is this an authentic Japanese NOS unit with original jets?', time: '10:18 AM' },
    { sender: 'seller', text: 'Yes, 100% factory original in preservative oil coating. Stamped MIKUNI JAPAN on the flange.', time: '10:20 AM' },
  ]);
  const [inputText, setInputText] = useState<string>('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { sender: 'me', text: inputText, time: 'Just now' }]);
    setInputText('');
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-6 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider block">
            DIRECT MESSAGING
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
            Restorer Communications Vault
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#161616] border border-[#2A2A2A] rounded overflow-hidden min-h-[600px]">
        {/* Left: Chat Contacts */}
        <div className="lg:col-span-4 border-r border-border p-4 space-y-2.5 bg-base">
          <h3 className="text-[12px] font-medium text-text-muted px-2">
            Active restorer inquiries
          </h3>

          <div
            onClick={() => setActiveChat('rajesh')}
            className={`p-3.5 rounded cursor-pointer transition-colors flex items-center gap-3 ${
              activeChat === 'rajesh'
                ? 'bg-surface-raised border border-accent/50'
                : 'hover:bg-surface border border-transparent'
            }`}
          >
            <div className="w-10 h-10 rounded bg-surface border border-border text-text-primary font-mono text-xs flex items-center justify-center font-bold">
              RV
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[13px] text-text-primary truncate">Rajesh Vintage Garage</h4>
                <span className="text-[10px] text-text-muted font-mono">10:20 AM</span>
              </div>
              <p className="text-[11px] text-text-muted truncate">Mikuni VM20 Slide Carburetor</p>
            </div>
          </div>

          <div
            onClick={() => setActiveChat('anand')}
            className={`p-3.5 rounded cursor-pointer transition-colors flex items-center gap-3 ${
              activeChat === 'anand'
                ? 'bg-surface-raised border border-accent/50'
                : 'hover:bg-surface border border-transparent'
            }`}
          >
            <div className="w-10 h-10 rounded bg-surface border border-border text-text-primary font-mono text-xs flex items-center justify-center font-bold">
              AC
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[13px] text-text-primary truncate">Anand Classic Spares</h4>
                <span className="text-[10px] text-text-muted font-mono">Yesterday</span>
              </div>
              <p className="text-[11px] text-text-muted truncate">Premier Padmini Chrome Hubcaps</p>
            </div>
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="lg:col-span-8 flex flex-col justify-between p-6 bg-surface">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-surface-raised border border-border font-mono text-xs flex items-center justify-center font-bold text-text-primary">
                {activeChat === 'rajesh' ? 'RV' : 'AC'}
              </div>
              <div>
                <h4 className="font-medium text-[14px] text-text-primary flex items-center gap-1.5">
                  {activeChat === 'rajesh' ? 'Rajesh Vintage Garage' : 'Anand Classic Spares'}
                  <CheckCircle2 className="w-4 h-4 text-verified" />
                </h4>
                <span className="text-[11px] text-text-muted">Verified stockist • Direct escrow messaging</span>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="space-y-4 py-6 overflow-y-auto flex-1 max-h-[420px]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded text-[13px] leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-accent text-white'
                      : 'bg-surface-raised border border-border text-text-primary'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-text-muted mt-1 px-1 font-mono">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t border-border">
            <input
              type="text"
              placeholder="Ask about part condition, shipping, dimensions..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-surface-raised border border-border rounded px-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-accent"
            />
            <Button type="submit" variant="primary" size="md">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
