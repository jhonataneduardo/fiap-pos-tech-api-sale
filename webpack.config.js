const path = require('path');

module.exports = {
    entry: './src/server.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@core': path.resolve(__dirname, 'src/core/'),
            '@modules': path.resolve(__dirname, 'src/modules/'),
            '@config': path.resolve(__dirname, 'src/config/'),
        },
    },
};
