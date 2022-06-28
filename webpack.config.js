const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =  {
    entry: './client/index.js',
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
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({template: './client/index.html'})],
    devServer: {
        static: {
        directory: path.resolve(__dirname, 'build'), 
        publicPath: '/build'
    },
    compress: true,
    port: 8080
}
}