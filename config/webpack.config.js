const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

module.exports = {
  entry: {
    epubParser: [resolveApp('src')]
  },
  output: {
    path: resolveApp('build/lib'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    chunkFilename: 'chunk.[id].js',

    // editor break point support
    // make sure the generated path in map file refers to the source file correctly
    devtoolModuleFilenameTemplate: '../../[resource-path]'
  },
  plugins: [
    // add support for node source map
    new webpack.BannerPlugin({
      banner: `require('source-map-support').install()`,
      raw: true,
      entryOnly: true
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          // {
          //   loader: 'babel-loader'
          // },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },
  externals: [nodeExternals(), 'xml2js', 'node-zip', 'jszip', 'crypt', 'jsdom']
}
