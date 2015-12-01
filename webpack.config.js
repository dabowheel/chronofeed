module.exports = {
  entry: {
    chronofeed: "./bundle/main.js",
    loglist: "./components/loglist/loglist.js"
  },
  output: {
    path: "build/scripts",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.hbs$/, loader: "handlebars-loader" }
    ]
  }
}
