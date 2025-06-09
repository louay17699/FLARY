export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'a long time ago';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'a long time ago';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  
  if (diffInSeconds < 60) return 'Active just now';
  
  
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Active ${minutes}m ago`;
  }
  
  
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Active ${hours}h ago`;
  }
  
  
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Active ${days}d ago`;
  }
  
  
  return `Active on ${new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })}`;
};