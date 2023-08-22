const path = require('path');

module.exports = {
  entry: './src/index.ts', // Entry point of your application
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js'], // File extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Process .ts files
        use: 'ts-loader', // Use ts-loader for .ts files
        exclude: /node_modules/, // Exclude node_modules directory
      },
    ],
  },
};