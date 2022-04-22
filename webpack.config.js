const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    // mode: "production",
    entry: {
        empty: "./src/js/empty.js",
    },
    devtool: "inline-source-map",
    devServer: {
        static: "./",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            chunks: ["empty"],
        }),
    ],
};
