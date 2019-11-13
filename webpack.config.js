const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  console.log(argv);
  return {
    mode: argv.mode,
    entry: {
      home: './src/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, './wwwroot'),
      filename: '[name].js?[hash]',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'source-map',
    target: 'web',
    stats: 'errors-only',
    devServer: {
      proxy: {
        '/api': {
          target: 'https://simpletrading-api-dev.monfex.biz',
          pathRewrite: {
            '^/api': '',
          },
          changeOrigin: true,
        },
        '/signalr': {
          target: 'https://simpletrading-api-dev.monfex.biz/',
          changeOrigin: true,
        },
      },
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      historyApiFallback: true,
      https: true,
      hot: false,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
        meta: {
          viewport: 'width=device-width, initial-scale=1.0',
        },
        title: 'Hello world - Shadi',
      }),
      new webpack.DefinePlugin({
        WS_HOST:
          argv.mode === 'production'
            ? JSON.stringify(argv.wshost)
            : JSON.stringify('/signalr'),
        API_STRING:
          argv.mode === 'production'
            ? JSON.stringify(argv.apistring)
            : JSON.stringify('/api'),
        AUTH_TOKEN: JSON.stringify('TraderID'),
      }),
    ],
  };
};
