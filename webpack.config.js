module.exports = {
    // 1
    entry: './js/index.js',
    // 2
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    // 3
    devServer: {
      contentBase: './dist'
    },
    resolve: {
        extensions: ['*', '.js']
    },
    module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          }
        ]
      },
    mode: 'development',
    watch: true
  };