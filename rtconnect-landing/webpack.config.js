const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports =  {
    entry: './client/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [ 'style-loader', 'css-loader', {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('node-sass'),
                    }
                }]
            },
            {
                test: /\.png|svg|jpg|gif$/,
                use: 'file-loader',
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({template: './index.html'})],
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:3000',
        }
    },
        static: {
        directory: path.resolve(__dirname, 'build'), 
        publicPath: '/build'
    },
    compress: true,
    port: 8080,
    hot: true
}
}