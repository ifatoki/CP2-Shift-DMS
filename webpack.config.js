const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: debug ? 'inline-sourcemap' : null,
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, '/client/client.jsx')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [
          /(node_modules|bower_components)/,
          /joi-browser/
        ],
        loader: [
          'react-hot-loader',
          'babel-loader'
        ]
      },
      {
        test: /\.json$/, loader: 'json-loader',
      },
    ],
  },
  output: {
    path: path.join(__dirname, '/client/assets/js'),
    publicPath: '/',
    filename: 'client.min.js',
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: debug ? [
    new Dotenv({
      path: './.env'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new Dotenv({
      path: './.env'
    })
  ],
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      joi: 'joi-browser'
    }
  },
};
