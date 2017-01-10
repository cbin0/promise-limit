'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _limit = require('./limit');

var _limit2 = _interopRequireDefault(_limit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  create: function create(Promise, limit) {
    return new _limit2.default(Promise, limit);
  }
};