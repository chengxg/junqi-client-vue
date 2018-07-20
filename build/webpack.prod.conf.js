'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const {
	VueLoaderPlugin
} = require('vue-loader')

const webpackConfig = merge(baseWebpackConfig, {
	mode: 'production',
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true,
			usePostCSS: true
		})
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[name].[chunkhash].js'),
		publicPath: config.build.assetsPublicPath
	},
	optimization: {
		// minimizer: true,
		providedExports: true,
		usedExports: true,
		//识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
		//依赖于optimization.providedExports和optimization.usedExports
		sideEffects: true,
		//取代 new webpack.optimize.ModuleConcatenationPlugin()
		concatenateModules: true,
		//取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
		noEmitOnErrors: true,
		splitChunks: {
			maxAsyncRequests: 2, // 最大异步请求数， 默认1
			maxInitialRequests: 2, // 最大初始化请求书，默认1
			cacheGroups: {
				// test: path.resolve(__dirname, '../node_modules'),
				commons: {
					chunks: 'async',
					minChunks: 3,
					maxInitialRequests: 5, // The default limit is too small to showcase the effect
					minSize: 0, // This is example is too small to create commons chunks
					name: 'common'
				}
			}
		},
		//提取webpack运行时的代码
		/*runtimeChunk: {
			name: 'manifest'
		}*/
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': require('../config/prod.env')
		}),
		new VueLoaderPlugin(),
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
					warnings: false
				}
			},
			sourceMap: config.build.productionSourceMap,
			parallel: true
		}),
		new MiniCssExtractPlugin({
			filename: utils.assetsPath('css/[name].[contenthash].css')
		}),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin({
			cssProcessorOptions: config.build.productionSourceMap ? {
				safe: true,
				map: {
					inline: false
				}
			} : {
				safe: true
			}
		}),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: config.build.index,
			template: 'index.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency'
		}),
		// keep module.id stable when vendor modules does not change
		new webpack.HashedModuleIdsPlugin(),
		// enable scope hoisting
		new webpack.optimize.ModuleConcatenationPlugin(),
		// copy custom static assets
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, '../static'),
			to: config.build.assetsSubDirectory,
			ignore: ['.*']
		}])
	]
})

if(config.build.productionGzip) {
	const CompressionWebpackPlugin = require('compression-webpack-plugin')

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if(config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig