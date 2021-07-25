const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: "./src/main.ts",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist",
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["dist"],
		}),
		new HtmlWebpackPlugin({
			template: "src/index.html",
		}),
		new HtmlWebpackPlugin({
			filename: "about/index.html",
			template: "src/about/index.html",
		}),
		new HtmlWebpackPlugin({
			filename: "skye/index.html",
			template: "src/skye/index.html",
		}),
		new CopyWebpackPlugin(
			[
				{
					from: "src/style.css",
					to: path.resolve(__dirname, "dist"),
				},
				{
					from: "src/favicon.ico",
					to: path.resolve(__dirname, "dist"),
				},
				{
					from: "src/static/images/*",
					to: path.resolve(__dirname, "dist/static/images/"),
				},
			],
			{
				debug: "info",
			}
		),
	],
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
};
