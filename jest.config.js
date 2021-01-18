module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileTransformer.js',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/src/__setups__/localstorage.ts'],
};
