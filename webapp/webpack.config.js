const path = require('path');
 
module.exports = {
  entry: path.join(__dirname, 'src/app.tsx'),
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: 'index.js',
    publicPath: '/assets/'
  },
  resolve: {
      modules: [
          path.join(__dirname, 'src'),
          'node_modules'
      ],
      extensions: [
          '.ts', '.tsx', '.js', '.json'
      ]
  },
  devtool: "#source-map",
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              use: 'babel-loader',
              exclude: /node_modules/
          },
          {
              test: /\.scss$/,
              loader: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
              test: /\.tsx?$/,
              loader: ['babel-loader', 'ts-loader']
          },
      ]
  }
};
