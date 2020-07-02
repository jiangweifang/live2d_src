const path = require('path');
module.exports = {
  entry: path.join(__dirname, 'src', 'main'),
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "live2d.js",
    chunkFilename: '[name].js'
  },
  
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '/dist/'),
    inline: true,
    host: 'localhost',
    port: 8080,
    open:true,
    hot:true,
  },
  mode:'development'
};