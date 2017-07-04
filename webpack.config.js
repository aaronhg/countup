var path = require("path")
var HtmlwebpackPlugin = require("html-webpack-plugin")
var ROOT_PATH = path.resolve(__dirname)
var APP_PATH = path.resolve(ROOT_PATH, "src")
var BUILD_PATH = path.resolve(ROOT_PATH, "build")

module.exports = {
    // devtool: "cheap-module-eval-source-map",
    entry: {
        app: [path.resolve(__dirname, "./src/app/app.js")],
    },
    output: {
        path: BUILD_PATH,
        filename: "bundle.js",
        publicPath: "/",
    },
    plugins: [
        new HtmlwebpackPlugin({
            inject: "body",
            template: "src/app/app.html",
        })
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                include: APP_PATH,
                exclude: /node_modules/,
                query: {
                    plugins: ["transform-decorators-legacy",
                        "transform-export-extensions",
                        // ["import", {
                        //     libraryName: "antd",
                        //     style: "css"
                        // }]
                    ],
                    presets: ["react", "stage-0", "es2015"],
                }
            },
            { test: /\.s?css$/, loader: "style-loader!css-loader!sass-loader" },
        ]
    },
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty",
        "crypto": "empty"
    },
}