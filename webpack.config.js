module.exports = {
  entry: [
    "./controllers/main.js",
    "./scripts/live-reload.js"
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
      }
    ]
  }
}
