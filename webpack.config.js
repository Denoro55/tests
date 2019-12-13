const path = require('path');

const conf = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'), // соединяет пути правильно
		filename: 'main.js',
		publicPath: 'dist/' // (при браузерсинке чтобы видело путь и обновляло автоматом)
	},
	devServer: {
		overlay: true // (для ошибок на экране вместо консоли)
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules'
			}
		]
	}
};

module.exports = conf;