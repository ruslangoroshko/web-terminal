export const getProcessId = () => {
  // TODO: regex please
  return new Date()
    .toISOString()
    .replace('-', '')
    .replace(':', '')
    .replace('Z', '');
};
