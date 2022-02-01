const commonConfig = require('./webpack.common.js');
const extendWebpackBaseConfig = require('@waldronmatt/webpack-config');
const path = require('path');
const webpack = require('webpack');
const { MFLiveReloadPlugin } = require('@module-federation/fmr');

const developmentConfig = {
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
    index: 'index.html',
    port: 8001,
    open: true,
    // writeToDisk: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // configure the plugin
    new MFLiveReloadPlugin({
      port: 8001, // the port your app runs on
      container: 'FormApp', // the name of your app, must be unique
      standalone: true, // false uses chrome extention
    }),
  ],
};

module.exports = extendWebpackBaseConfig(commonConfig, developmentConfig);
