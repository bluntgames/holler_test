var webpack = require('webpack');
var path = require('path');

module.exports = {
    resolve: {
        modulesDirectories: ["web_modules", "node_modules", "bower_components"]
    },
    context: __dirname +  path.sep + 'app',
    entry: {
        app: '.' + path.sep + 'app.js',
        vendor: ['three', 'stats.js', 'tween.js']
    },
    loaders: [ 
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
            presets: ['es2015']
        }
    }],
    output: {
        path: path.join(__dirname,'public'),
        filename: 'app.bundle.js',
        libraryTarget: 'var',
        library: 'TestApp',
        publicPath: 'http://localhost:6556/'//,
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new webpack.NoErrorsPlugin (),
        new webpack.ProvidePlugin({ THREE: "three" }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        )
    ]
};