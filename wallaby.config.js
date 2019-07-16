module.exports = function(wallaby) {
  return {
    env: {
      type: "node"
    },

    compilers: {
      "**/*.ts?(x)": wallaby.compilers.typeScript({
        module: "commonjs",
        typescript: require("typescript")
      })
    },

    testFramework: "jest",

    files: ["./jest.init.js", "./src/**/*.ts", "!./src/**/*.spec.ts"],

    tests: ["./src/**/*.spec.ts"]
  };
};
