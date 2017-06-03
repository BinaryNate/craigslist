'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ForSaleSubcategory = require('./ForSaleSubcategory');

var _ForSaleSubcategory2 = _interopRequireDefault(_ForSaleSubcategory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @enum {string} - Search categories.
*/
var Category = {

    FOR_SALE: 'sss'
};

Object.assign(Category, _ForSaleSubcategory2.default);

exports.default = Category;