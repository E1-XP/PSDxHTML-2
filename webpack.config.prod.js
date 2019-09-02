const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackCleanPlugin = require('webpack-clean');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('clean-css');

module.exports = {
  entry: ['./src/js/index.js', './src/scss/main.scss'],
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(svg|gif|jpg|png|eot|woff|ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25000,
            fallback: 'file-loader',
            name: './assets/img/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
      minify: { collapseWhitespace: true }
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CopyPlugin([{ from: './src/assets', to: './assets' }]),
    new WebpackCleanPlugin(['./public/main.css', './public/main.js'])
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin(),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cleanCSS
      })
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  }
};
