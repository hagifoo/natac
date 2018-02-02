const path = require('path');
 
module.exports = {
  entry: path.join(__dirname, 'src/app.js'),
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: 'index.js',
    publicPath: '/assets/'
  },
  resolve: {
      modules: [
          path.join(__dirname, 'src'),
          'node_modules'
      ]
  },
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
      }
    ]
  }
};
