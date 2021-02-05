export default (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }
  if (value.length) {
    return parseFloat(value.replace(',', '.'));
  } else {
    return undefined;
  }
};
