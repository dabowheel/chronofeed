module.exports = {
  entry: [
    "./controllers/main.js"
  ],
  output: {
    path: "public/scripts",
    filename: "chronofeed.js"
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
