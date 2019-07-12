var path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
      bundle: ['./index.ts'],
  },
//   context: path.resolve(__dirname),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'temp')
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins:[
    new CopyWebpackPlugin([{from: 'src/**/*'}])
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};