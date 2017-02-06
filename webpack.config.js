'use strict';

var path = require('path');
var webpack = require('webpack');
var extend = require('extend');

var production = process.env.NODE_ENV == 'production';

var entries = ['./scripts/index'];

var plugins = [
  require('webpack-notifier')
];


if(!production) {
  entries = [
    'webpack-dev-server/client?http://localhost:9000'
  ].concat(entries);

  plugins = [
    new webpack.NoErrorsPlugin()
  ].concat(plugins);
}


module.exports = {
  devtool: 'inline-source-map',
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  node: {
    fs: 'empty'
  },
  plugins: plugins,
  resolve: {
    modulesDirectories: ['./scripts', './node_modules', 'assets'],
    extensions: ['', '.js', '.jsx', '.png']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel']
    }, {
      test: /\.css$/,
      loaders: ['style', 'css']
    }, {
      test: /\.styl$/,
      loaders: ['style', 'css', 'stylus']
    }, {
      test: /\.mp3$/,
      loaders: ['file']
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
};

