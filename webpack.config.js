const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'pmDrag.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development'
};