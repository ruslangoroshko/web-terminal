export default (value: string) => {
  if (value.length) {
    return parseFloat(value.replace(',', '.'));
  } else {
    return null;
  }
};
