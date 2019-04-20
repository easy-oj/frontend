const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const fedPath = path.resolve(__dirname, '../')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.html'],
    alias: {
      '@': path.resolve(fedPath, './src')
    }
  },
  entry: {
    app: path.resolve(fedPath, './src/entry.tsx')
  },
  output: {
    filename: '[name].[hash].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(j|t)s(x)?/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'es2015'
            },
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory({
                  libraryName: 'antd',
                  libraryDirectory: 'lib',
                  style: true
                })
              ]
            })
          }
        }
      },
      {
        test: /\.(s)?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              modifyVars: {
                'primary-color': '#157efb',
                'link-color': '#157efb',
                'border-radius-base': '2px'
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(fedPath, './static/index.html')
    }),
    new MonacoWebpackPlugin()
  ],

  devServer: {
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
    https: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300
    },
    proxy: {
      '/api': {
        target: 'https://dev.moekr.com',
        changeOrigin: true
      }
    }
  }
}
