const path = require('path');
module.exports = {
  entry: path.join(__dirname, 'src', 'waifu-tips'),
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "live2d.js",
    chunkFilename: '[name].js'
  },
  performance: {
    hints:'warning',
    //入口起点的最大体积
    maxEntrypointSize: 50000000,
    //生成文件的最大体积
    maxAssetSize: 30000000,
    //只给出 js 文件的性能提示
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js');
    }
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '/'),
    inline: true,
    host: 'localhost',
    port: 8080,
    open:true,
    hot:true,
  },
  mode:'production'
};