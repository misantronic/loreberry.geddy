var webpack            = require('webpack');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		embed: __dirname + '/app/js/embed'
	},

	output: {
		path: __dirname + '/public',
		filename: '[name].js'
	},

	module: {
		loaders: [
			{ test: /\.ejs$/, loader: 'ejs-loader' },
			{ test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' }
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/app/index.ejs',
			filename: 'index.html',
			inject: true
		}),

		new CleanWebpackPlugin(['public'])
	],

	devtool: 'sourcemap',

	debug: true
};
