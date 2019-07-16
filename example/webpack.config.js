const path = require("path");
var webpack = require("webpack");

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.CVA_PORT = process.env.CVA_PORT || 9000;

const config = function(mode) {
  let conf = {
    devServer: {
      compress: true,
      contentBase: "public",
      hot: true,
      port: process.env.CVA_PORT,
      watchOptions: {
        ignored: /node_modules/
      }
    },
    entry: ["./src/index.js"],
    mode: mode,
    module: {
      rules: [
        {
          exclude: /(node_modules|bower_components)/,
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["env"]
            }
          }
        },
        {
          exclude: /(node_modules|bower_components)/,
          test: /\.html$/,
          use: {
            loader: "html-loader",
            options: {}
          }
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "public/bundle/"),
      publicPath: "/"
    },
    plugins: [],
  };

  if (mode === "development") {
    conf.plugins.push(new webpack.HotModuleReplacementPlugin());
    conf.plugins.push(new webpack.NoEmitOnErrorsPlugin());
  }

  return conf;
};

module.exports = config(process.env.NODE_ENV);
