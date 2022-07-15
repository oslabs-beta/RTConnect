const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './Example/client/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    
    mode: process.env.NODE_ENV,
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
    plugins: [new HtmlWebpackPlugin({template: './Example/client/index.html'})],
    devServer: {
        proxy: {
            '/api': {
                target: 'ws://localhost:3001',
                ws: true
        }
    },
        static: {
        directory: path.resolve(__dirname, 'build'), 
        publicPath: '/build'
    },
    compress: true,
    port: 8080
}
}