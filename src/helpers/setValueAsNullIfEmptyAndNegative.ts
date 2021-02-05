import hasValue from './hasValue';

export default (value: string | undefined) => {
  return value ? Math.abs(parseFloat(value.replace(',', '.'))) : undefined;
};
