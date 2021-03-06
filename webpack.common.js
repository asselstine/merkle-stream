const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
require("@babel/register")
require("@babel/polyfill")

module.exports = {
  entry: ['@babel/polyfill', './app/javascripts/app.js'],
  externals: {
    sharp: 'commonjs sharp'
  },
  node: {
    fs: "empty"
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [

    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/*.html', flatten: true },
      { from: './app/images', to: 'images/' },
      { from: './app/stylesheets/vendor', to: 'vendor/' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        use: [ 'file-loader?name=[name].[ext]' ]
      },
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // /node_modules\/(?!(instascan)\/).*/,
        use: 'babel-loader'
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.scss', '.css', '.js', '.jsx', '.json'],
  },
  devServer: {
    historyApiFallback: true
  }
}
