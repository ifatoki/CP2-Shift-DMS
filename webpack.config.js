const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const entry = [
  path.join(__dirname, '/client/client.jsx')
];
const plugins = [
  new Dotenv({
    path: './.env'
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
];
if (debug) {
  entry.push('webpack-hot-middleware/client');
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
} else {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}


module.exports = {
  devtool: debug ? 'inline-sourcemap' : false,
  entry,
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
  plugins,
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      joi: 'joi-browser'
    }
  },
};
