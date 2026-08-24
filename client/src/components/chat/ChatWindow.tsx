import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MapPin, CheckCircle, Shield } from 'lucide-react';
import { IConversation, IMessage, IUser } from '../../types/index.js';
import { MessageBubble } from './MessageBubble.js';
import { chatService } from '../../services/orderService.js';
import { useAuth } from '../../context/AuthContext.js';
import { useSocket } from '../../context/SocketContext.js';
import { Button } from '../common/Button.js';

export interface ChatWindowProps {
  conversation: IConversation;
  onSendMessage?: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?._id || user?.id;

  const otherParticipant = conversation.participants.find(
    (p) => (typeof p === 'object' ? p._id || p.id : p) !== currentUserId
  ) as IUser | undefined;

  // Load message history
  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await chatService.getMessages(conversation._id);
      setMessages(data || []);
      await chatService.markAsRead(conversation._id);
    } catch (err) {
      console.warn('Failed to load chat history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    if (socket) {
      socket.emit('join:conversation', conversation._id);

      const handleNewMessage = (msg: IMessage) => {
        if (msg.conversation === conversation._id) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      socket.on('message:new', handleNewMessage);

      return () => {
        socket.emit('leave:conversation', conversation._id);
        socket.off('message:new', handleNewMessage);
      };
    }
  }, [conversation._id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      setSending(true);
      const res = await chatService.sendMessage({
        conversationId: conversation._id,
        text: textToSend,
        listingId: conversation.listing?._id,
      });

      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.warn('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const quickTemplates = [
    'Is this part still available?',
    'Is the price negotiable?',
    'Can you provide more high-res photos?',
    'Can you ship via insured courier to my city?',
  ];

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-card overflow-hidden text-text-primary">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-surface-raised flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-surface border border-border text-text-primary font-mono text-xs flex items-center justify-center font-bold">
            {otherParticipant?.name ? otherParticipant.name.slice(0, 2).toUpperCase() : 'RP'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-sm text-text-primary font-display">
                {otherParticipant?.name || 'Seller'}
              </h3>
              {otherParticipant?.isVerifiedSeller && (
                <span className="text-[10px] font-medium text-verified flex items-center gap-0.5 bg-verified/15 px-1.5 py-0.5 rounded border border-verified/30">
                  <CheckCircle className="w-3 h-3" /> Verified restorer
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-text-muted" />
                {otherParticipant?.location?.city || 'India'}
              </span>
              <span>•</span>
              <span className="text-success font-medium">Online</span>
            </div>
          </div>
        </div>

        {otherParticipant?.phone && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-secondary bg-surface px-3 py-1.5 rounded border border-border">
            <Phone className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono">{otherParticipant.phone}</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 bg-base">
        {/* Safe Escrow Notice */}
        <div className="p-3 mb-4 rounded bg-surface border border-border flex items-center gap-2.5 text-xs text-text-secondary max-w-lg mx-auto">
          <Shield className="w-4 h-4 text-accent shrink-0" />
          <span>
            Always complete transactions via <strong className="text-text-primary">RetroParts Escrow Checkout</strong> for 100% money-back fitment protection.
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center p-8 text-xs text-text-muted">
            No messages yet. Send an inquiry or choose a quick prompt below!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isCurrentUser={
                (typeof msg.sender === 'object' ? msg.sender._id || msg.sender.id : msg.sender) === currentUserId
              }
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-surface-raised border-t border-border flex items-center gap-2 overflow-x-auto text-[11px]">
        {quickTemplates.map((tmpl, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(tmpl)}
            className="whitespace-nowrap px-3 py-1 rounded bg-surface border border-border text-text-secondary hover:text-accent hover:border-accent/40 transition-colors"
          >
            {tmpl}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-surface-raised border-t border-border flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message or inquiry..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-surface border border-border rounded px-4 py-2.5 text-xs sm:text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={sending}
          rightIcon={<Send className="w-4 h-4" />}
          disabled={!inputText.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
