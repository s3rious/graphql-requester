const babelConfig = require('./.babelrc.js')

const folders = [
  'src',
]

const getFiles = (isTests) =>
  folders
    .map((folder) => {
      if (isTests) {
        return [
          `./${folder}/**/*.spec.js`,
          `./${folder}/**/*.spec.ts`,
        ]
      }

      return [
        `./${folder}/**/*.js`,
        `./${folder}/**/*.ts?(x)`,
        `!./${folder}/**/.story.js`,
        `!./${folder}/**/*.spec.js`,
        `!./${folder}/**/*.spec.ts`,
      ]
    })
    .reduce((array, pair) => [ ...array, ...pair ], [])


module.exports = (wallaby) => ({
  env: {
    type: 'node',
    runner: 'node',
  },
  compilers: {
    '**/*.js': wallaby.compilers.babel(babelConfig),
    '**/*.ts': wallaby.compilers.babel(babelConfig),
  },
  files: [
    './jest.init.js',
    ...getFiles(false),
  ],
  tests: getFiles(true),
  testFramework: 'jest',
})
