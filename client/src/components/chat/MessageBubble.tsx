import React from 'react';
import { IMessage } from '../../types/index.js';
import { timeAgo, formatPrice } from '../../utils/formatters.js';
import { Link } from 'react-router-dom';

export interface MessageBubbleProps {
  message: IMessage;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const listingRef = message.listingReference;

  return (
    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} mb-3`}>
      {/* Attached Listing Card Header if present */}
      {listingRef && (
        <Link
          to={`/parts/${listingRef._id}`}
          className="mb-1.5 p-2 rounded bg-surface border border-border hover:border-accent/40 transition-colors flex items-center gap-2.5 max-w-xs shadow-md"
        >
          <img
            src={listingRef.images?.[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=150&auto=format&fit=crop&q=80'}
            alt={listingRef.title}
            className="w-10 h-10 rounded object-cover bg-base shrink-0 border border-border"
          />
          <div className="min-w-0 text-left">
            <p className="text-[10px] uppercase font-medium text-accent tracking-wider">Inquiring about</p>
            <p className="text-xs font-medium text-text-primary truncate">{listingRef.title}</p>
            <p className="text-xs font-mono font-bold text-text-secondary">{formatPrice(listingRef.price)}</p>
          </div>
        </Link>
      )}

      {/* Message Text Bubble */}
      <div
        className={`max-w-md px-4 py-2.5 rounded text-xs sm:text-sm leading-relaxed shadow-sm ${
          isCurrentUser
            ? 'bg-accent text-white font-normal'
            : 'bg-surface-raised text-text-primary border border-border'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-text-muted mt-1 px-1 font-mono">
        {timeAgo(message.createdAt)}
      </span>
    </div>
  );
};
