export const formatDate = (date: Date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return messageDate.toLocaleDateString();
};

export const truncateContent = (content: string, maxLength: number = 25) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};
