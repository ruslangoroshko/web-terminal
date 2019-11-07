const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode,
  entry: {
    home: './src/index', 
    // http: './src/http-layer', 
    // WAMP: './src/WAMP-layer', 
  },
  output: {
    path: path.resolve(__dirname, '../wwwroot'), // string
    filename: '[name].js?[hash]', // string
    publicPath: '/', // string
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, './')],
        exclude: [],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, './')],
    extensions: ['.js', '.json', '.jsx', '.css'],
    alias: {},
  },
  devtool: 'source-map', // enum
  context: __dirname, // string (absolute path!)
  target: 'web', // enum
  externals: ['react'],
  stats: 'errors-only',
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: false, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
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
  ],
});
