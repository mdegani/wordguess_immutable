module.exports = {
    entry: "./src.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
      preLoaders: [
        { test: /\.js$/, loader: 'eslint-loader' },
      ],
      loaders: [
          { test: /\.js$/, loaders: ['react-hot', 'babel-loader'], exclude: /node_modules/ },
          { test: /\.css$/, loader: 'style-loader!css-loader' },
      ]
    }
};
