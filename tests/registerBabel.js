let babelPresetLatest = require('babel-preset-latest');

require('babel-register')({
    sourceMap: 'both',
    presets: [ babelPresetLatest ]
});
