export const sanitizeProject = (str: string) => {
  if (!str) return '';
  return str.replace(/(\t+|\s+$|^\s+)/, '');
};
