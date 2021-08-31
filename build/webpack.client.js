const base = require('./webpack.config')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const {merge} = require('webpack-merge')
module.exports = merge(base, {
    entry: {
        client: path.resolve(__dirname, '../src/client-entry.js')
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //     },
    // },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../public/index2.html')
        })
    ]
})
