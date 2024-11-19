export const formatTimeRemaining = (targetDate: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = targetDate - now;
  
    if (remaining <= 0) return "Expired";
  
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
  
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
  };
  
  export const formatTransactionDate = (timestamp: number): string => {
    const normalizedTimestamp = timestamp.toString().length > 10 
      ? timestamp 
      : timestamp * 1000;
  
    const date = new Date(normalizedTimestamp);
    const year = date.getFullYear();
    
    if (year > 2100 || year < 2000) {
      return new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });
    }
  
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  };