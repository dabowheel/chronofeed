module.exports = {
  entry: [
    "./controllers/main.js"
  ],
  output: {
    path: "public/scripts",
    filename: "grackle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
      }
    ]
  }
}
