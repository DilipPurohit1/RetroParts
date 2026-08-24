export const formatPrice = (price: number | string): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const timeAgo = (dateString: string | Date): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const getRarityBadge = (rarity: string) => {
  switch (rarity) {
    case 'Collector Grade':
    case 'Extremely Rare / Holy Grail':
      return {
        label: 'Collector Grade',
        classes: 'bg-[#200A0A] text-[#E10600] border border-[#E10600]/40 font-mono font-bold',
      };
    case 'Rare Find':
      return {
        label: 'Rare find',
        classes: 'bg-warning/15 text-warning border border-warning/30 font-medium',
      };
    case 'Discontinued OEM':
      return {
        label: 'Discontinued OEM',
        classes: 'bg-surface-raised text-text-secondary border border-border font-medium',
      };
    default:
      return {
        label: 'Vintage standard',
        classes: 'bg-surface-raised text-text-muted border border-border font-normal',
      };
  }
};

export const getConditionBadge = (condition: string) => {
  switch (condition) {
    case 'NOS (New Old Stock)':
      return {
        label: 'NOS (new old stock)',
        classes: 'bg-verified/15 text-verified border border-verified/30 font-medium',
      };
    case 'OEM Mint':
      return {
        label: 'OEM mint',
        classes: 'bg-surface-raised text-text-primary border border-border font-medium',
      };
    case 'OEM Refurbished':
      return {
        label: 'Refurbished OEM',
        classes: 'bg-surface-raised text-text-secondary border border-border font-medium',
      };
    case 'Used - Grade A':
      return {
        label: 'Used (grade A)',
        classes: 'bg-surface-raised text-text-secondary border border-border font-normal',
      };
    default:
      return {
        label: condition ? condition.toLowerCase() : 'used',
        classes: 'bg-surface-raised text-text-muted border border-border font-normal',
      };
  }
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
