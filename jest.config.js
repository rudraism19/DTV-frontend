module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/env.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  watchPathIgnorePatterns: [
    '<rootDir>/extensions/',
    '<rootDir>/my-app/',
    '<rootDir>/digital-twin-project/'
  ]
};
