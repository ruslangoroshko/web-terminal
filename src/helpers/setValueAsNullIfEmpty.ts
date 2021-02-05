export default (value: string | undefined) => {
  return value ? parseFloat(value.replace(',', '.')) : undefined;
};
