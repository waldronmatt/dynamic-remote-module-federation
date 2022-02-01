const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { ModuleFederationPlugin } = require('webpack').container;
const DynamicContainerPathPlugin = require('dynamic-container-path-webpack-plugin');
const setPublicPath = require('dynamic-container-path-webpack-plugin/set-path');

const chunks = require('./config/chunks.config.json');
const mainEntry = chunks.entrypoints[0];

const commonConfig = isProduction => {
  // project-specific configurations are located here
  const ModuleFederationConfiguration = () => {
    return new ModuleFederationPlugin({
      name: 'FormApp',
      filename: 'remoteEntry.js',
      exposes: {
        './initContactForm': './src/form/init-contact-form',
      },
    });
  };

  return {
    target: 'web',
    entry: {
      [mainEntry]: ['./src/bootstrap.js'],
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, './dist'),
      clean: true,
    },
    optimization: {
      /*
        disable webpack base config `runtimeChunck: single`
        https://github.com/webpack/webpack/issues/11691
      */
      runtimeChunk: false,
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      new CopyPlugin({
        patterns: [{ from: 'config', to: '' }],
      }),
      new WebpackAssetsManifest({}),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        title: `${mainEntry}`,
        description: `${mainEntry} of Module Federation`,
        template: 'src/index.html',
        favicon: 'public/favicon.png',
        /*
          here we strip out the entry point
          because we don't want it duplicated when we call it again dynamically at runtime
        */
        excludeChunks: [...chunks.entrypoints],
      }),
      new ModuleFederationPlugin({
        name: 'FormApp',
        filename: 'remoteEntry.js',
        exposes: {
          './initContactForm': './src/form/init-contact-form',
        },
      }),
      new DynamicContainerPathPlugin({
        // provide the code to get `publicPath` at runtime
        iife: setPublicPath,
        /*
          Provide the main entry point as an argument to the plugin above. The value will be
          provided as a key to `map.config.json` to get the URL for this app
        */
        entry: mainEntry,
      }),
    ].concat(ModuleFederationConfiguration),
  };
};

module.exports = commonConfig;
