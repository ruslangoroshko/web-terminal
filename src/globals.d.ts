import '@testing-library/jest-dom/extend-expect';

declare module '*.png' {
  const value: any;
  export = value;
}
