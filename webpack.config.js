const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const manifestPlugin = require('webpack-manifest-plugin');
const visualizer = require('webpack-visualizer-plugin');

module.exports = {
  node: {
    fs: "empty"
  },
  entry: [
    'core-js/fn/promise',
    path.join(__dirname, 'src', 'main')
  ],
  watch: true,
  output: {
    filename: "live2d.js",
    chunkFilename: 'live2d.[id].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  
  resolve: {
    extensions: ['.json', '.js', '.ts']
  },
  target: 'web',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '/dist/'),
    inline: true,
    host: 'localhost',
    port: 8080,
    hot:true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        }],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      cache: false,
      parallel:true,
      terserOptions:{warnings:false,mangle: true},
    })],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new manifestPlugin(),
    new visualizer()
  ],
  //mode:'development'
  mode:'production'
};