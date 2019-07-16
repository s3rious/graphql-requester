module.exports = function (wallaby) {

  return {
    env: {
      type: 'node',
    },

    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({
        typescript: require('typescript'),
        module: 'commonjs',
      })
    },

    testFramework: 'jest',

    files: [
      './jest.init.js',

      './src/**/*.ts',
      '!./src/**/*.spec.ts',
    ],

    tests: [
      './src/**/*.spec.ts',
    ],
  }
}
