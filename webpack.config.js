//webpack.config.js
var webpack = require('webpack');//引入Webpack模块供我们调用，这里只能使用ES5语法，使用ES6语法会报错
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: ['webpack/hot/dev-server', __dirname + '/app/main.js'],
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query:{
                    presets:["es2015","stage-2","react"],
                    plugins: [["import", {
                        "libraryName": "antd",
                        "style": true  // or 'css'
                    }]]
                }
            },
            {
                test: /\.(less|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'less-loader']
                })
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('formCreater.css'),
        new webpack.HotModuleReplacementPlugin()

        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    }
        //}),
        //new webpack.DefinePlugin({
        //    'process.env':{
        //        'NODE_ENV': JSON.stringify('production')
        //    }
        //}),
    ],

    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        inline: true,
        port: 8199
    }
};