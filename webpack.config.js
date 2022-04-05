const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const GlobEntries = require("webpack-glob-entries");

module.exports = {
  mode: "production",
  entry: GlobEntries("./src/*test*.ts"),
  output: {
    path: path.join(__dirname, "dist"),
    libraryTarget: "commonjs",
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  target: "web",
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
  // Generate map files for compiled scripts
  devtool: "source-map",
  stats: {
    colors: true,
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: false,
  },
  performance: {
    // allow big file sizes for compiled js output
    // Note: falso causes test files to be 450kb
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
