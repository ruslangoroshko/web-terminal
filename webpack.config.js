const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const reCaptchaKey = '6LeM1vwUAAAAAI11ZbVvby8DFwiD8eftdFReegmr';
  const reCaptchaKeyDev = '6Le22PwUAAAAADoNtCk9zkQb-HXjuARfS1rRrIze';

  return {
    mode: argv.mode,
    entry: {
      home: './src/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, './wwwroot'),
      filename: '[name].js?[hash]',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|ico|woff|woff2)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          include: [path.resolve(__dirname, './src/assets/svg/')],
          exclude: [path.resolve(__dirname, './src/assets/svg_no_compress/')],
          use: [
            'svg-sprite-loader',
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  {
                    removeAttrs: { attrs: '(fill)' },
                  },
                ],
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          include: [path.resolve(__dirname, './src/assets/svg_no_compress/')],
          use: [
            'svg-sprite-loader',
            {
              loader: 'svgo-loader',
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
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
      compress: true,
      historyApiFallback: true,
      https: false,
      hot: false,
      port: 8080,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
        meta: {
          viewport: 'width=device-width, initial-scale=1.0',
        },
        title: 'Hello world - Shadi',
        captcha: JSON.stringify(
          'https://www.google.com/recaptcha/api.js?render=' +
            (argv.mode === 'production' ? reCaptchaKey : reCaptchaKeyDev)
        ),
      }),
      new webpack.DefinePlugin({
        WS_HOST:
          argv.mode === 'production'
            ? JSON.stringify('/signalr')
            : JSON.stringify('http://localhost:5678/signalr'),
        API_STRING:
          argv.mode === 'production'
            ? JSON.stringify('')
            : JSON.stringify('http://localhost:5678'),
        API_AUTH_STRING:
          argv.mode === 'production'
            ? JSON.stringify('')
            : JSON.stringify('http://localhost:5679'),

        // TODO: exlude api auth string "auth"
        API_DEPOSIT_STRING:
          argv.mode === 'production'
            ? JSON.stringify('/deposit')
            : JSON.stringify('http://localhost:5680'),
        AUTH_TOKEN: JSON.stringify('TraderID'),
        CHARTING_LIBRARY_PATH:
          argv.mode === 'production'
            ? JSON.stringify('./charting_library/')
            : JSON.stringify('./src/vendor/charting_library/'),
        IS_LIVE: argv.mode === 'production',
        MIXPANEL_TOKEN: JSON.stringify('582507549d28c813188211a0d15ec940'),
        RECAPTCHA_KEY:
          argv.mode === 'production'
            ? JSON.stringify(reCaptchaKey)
            : JSON.stringify(reCaptchaKeyDev),
      }),
      new CopyPlugin([
        { from: './src/vendor/charting_library/', to: 'charting_library' },
        { from: './src/apple-app-site-association', to: '' },
        { from: './src/robots.txt', to: '' },
      ]),
    ],
  };
};
