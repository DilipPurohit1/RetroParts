import React from 'react';
import { IConversation, IUser } from '../../types/index.js';
import { timeAgo } from '../../utils/formatters.js';
import { CheckCircle } from 'lucide-react';

export interface ConversationListProps {
  conversations: IConversation[];
  activeConversationId?: string;
  onSelectConversation: (conv: IConversation) => void;
  currentUserId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted text-xs">
        No active conversations yet. Click "Contact Seller" on any listing to start an inquiry.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border overflow-y-auto text-text-primary">
      {conversations.map((conv) => {
        const otherParticipant = conv.participants.find(
          (p) => (typeof p === 'object' ? p._id || p.id : p) !== currentUserId
        ) as IUser | undefined;

        const isSelected = conv._id === activeConversationId;
        const participantName = otherParticipant?.name || 'Automotive Restorer';

        return (
          <button
            key={conv._id}
            onClick={() => onSelectConversation(conv)}
            className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
              isSelected
                ? 'bg-surface-raised border-l-2 border-accent'
                : 'hover:bg-surface-raised bg-surface'
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded bg-base border border-border text-text-primary font-mono text-xs flex items-center justify-center font-bold">
                {participantName.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-surface" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium text-text-primary truncate flex items-center gap-1">
                  {participantName}
                  {otherParticipant?.isVerifiedSeller && (
                    <CheckCircle className="w-3 h-3 text-verified shrink-0" />
                  )}
                </h4>
                <span className="text-[10px] text-text-muted font-mono">
                  {conv.lastMessageAt ? timeAgo(conv.lastMessageAt) : ''}
                </span>
              </div>

              <p className="text-xs text-text-secondary truncate leading-relaxed">
                {conv.lastMessage || 'Started conversation'}
              </p>

              {conv.listing && (
                <span className="inline-block mt-1 text-[11px] text-accent truncate max-w-full font-mono">
                  📦 {conv.listing.title}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
