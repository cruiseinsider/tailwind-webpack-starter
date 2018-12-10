const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g);
  }
}

module.exports = {
  entry: './src/styles.css',
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css', {
      disable: process.env.NODE_ENV === 'development',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    })
  ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new PurgecssPlugin({
      paths: glob.sync([
        path.join(__dirname, "src/**/*.html")
      ]),
      extractors: [
        {
          extractor: TailwindExtractor,
          extensions: ['html']
        }
      ]
    })
  );
}
