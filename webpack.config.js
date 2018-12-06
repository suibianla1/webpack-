const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require("glob") 

function getEntries(pattern){
  //glob可以异步读取文件
  var fileList = glob.sync(pattern);
  let obj = {};
  fileList.forEach(item => {
    let pathUrl = item.split('/')
    let key = pathUrl[pathUrl.length-1].split('.')[0]
    obj[key] = './'+item
  });
  return obj
}

const jsRegx = `src/js/*.js`
const htmlRegx = `src/component/*.html`
const jsEntries = getEntries(jsRegx)
const htmlEntries = getEntries(htmlRegx)

let htmlPlugins = []
for (key in htmlEntries){
  const config = {
    filename: './page/'+ key + '.html',
    template: htmlEntries[key],
    // inject: 'body',           //script标签的放置
    title: 'index title test',
    minify: {                    //html压缩
      removeComments: true,     //移除注释
      collapseWhitespace: true //移除空格
    },
    chunks: [],    
  }
  // 遍历判断注入每个页面对应的JS文件
  for (el in jsEntries){
    if (el === key) {
      config.chunks.push(key)
    }
  }
  htmlPlugins.push(new htmlWebpackPlugin(config))
}

module.exports = {
  mode: 'development', // 线上环境为production，开发环境则切换成 development
  // entry: {
  //   'index': './src/js/index.js',
  //   'a': './src/js/a.js',
  //   'b': './src/js/b.js'
  // },
  entry: jsEntries,
  output: {
    filename: 'js/[name]-bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules:[
      //处理js中的loader
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '/src'),
        exclude: path.resolve(__dirname, '/node_modules')
      },
      //处理css中的loader
      {
        test: /\.css$/,
        // loader: ['style-loader', 'css-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      //处理sass中的loader
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      //处理less中的loader
      {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader']
      },
       //处理图片中的loader
      {
        test: /\.(jpg|png|jpeg|bmp|gif)$/,
        loader: ['url-loader?limit=1048576&name=./dist/images/[name].[ext][hash]'],
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        loader: ['file-loader?name=./dist/fonts/[name].[ext][hash]']
      }
    ]   
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      // inject: 'body',           //script标签的放置
      title: 'index title test',
      minify: {                    //html压缩
        removeComments: true,     //移除注释
        collapseWhitespace: true //移除空格
      },
      chunks: ['index'],      //生成html页面后的script文件的引入
      //排除没有用到的script文件，其他的都引进来，比chunks更好匹配
      // excludeChunks: ['b']    //引入了main.js和aaa.js
    }),

    // new htmlWebpackPlugin({
    //   filename: './page/b.html',
    //   template: './src/component/b.html',
    //   // inject: 'body',           //script标签的放置
    //   title: 'index title test',
    //   minify: {                    //html压缩
    //     removeComments: true,     //移除注释
    //     collapseWhitespace: true //移除空格
    //   },
    //   chunks: ['b'],      //生成html页面后的script文件的引入
    //   //排除没有用到的script文件，其他的都引进来，比chunks更好匹配
    //   // excludeChunks: ['b']    
    // }),

    ...htmlPlugins,

    //单独引入css
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "[name].[contenthash].css"
    })
  ]
};

