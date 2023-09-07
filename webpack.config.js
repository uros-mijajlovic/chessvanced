const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './dist/src/connectStockfish.js', // Entry point of your application
  optimization: {
    'minimize': true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          pure_funcs: [
            'console.log',
            'console.info',
            'console.debug',
            'console.warn'
          ]
        }
      }
    })],
  },
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'distWebpack'), // Output directory
  },
};