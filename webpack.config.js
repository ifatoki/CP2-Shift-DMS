const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: debug ? 'inline-sourcemap' : null,
  entry: './client/client.jsx',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'node6', 'stage-0'],
          plugins: [
            'react-html-attrs',
            'transform-class-properties',
            'transform-decorators-legacy'
          ],
        },
      },
      {
        test: /\.json$/, loader: 'json-loader',
      },
    ],
  },
  output: {
    path: `${__dirname}/client/assets/js`,
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
    })] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
      new Dotenv({
        path: './.env'
      })
    ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
