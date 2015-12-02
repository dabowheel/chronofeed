module.exports = {
  entry: {
    chronofeed: "./bundle/main.js",
    loglist: "./components/loglist/loglist.js",
    log: "./components/log/log.js",
    app: "./components/app/main.js"
  },
  output: {
    path: "build/scripts",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: "vue"
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        query: {
          presets: ['es2015'],
          plugins: ["transform-runtime"]
        }
      },
      {
        test: /\.html$/,
        loader: "html"
      }
    ]
  }
}
