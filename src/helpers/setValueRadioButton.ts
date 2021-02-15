export default (value: string | undefined) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value ? JSON.parse(value) : false;
  }
};
