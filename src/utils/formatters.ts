import { formatDistanceToNow, format } from 'date-fns';

export const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'Unknown time';
  
  const date = new Date(timestamp * 1000);
  
  if (Date.now() - date.getTime() > 24 * 60 * 60 * 1000) {
    return format(date, 'MMM d, yyyy HH:mm');
  }
  
  return formatDistanceToNow(date, { addSuffix: true });
};