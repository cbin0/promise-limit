'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var start = function start(queue) {
  var index = -1;
  if (queue.status == 'started') return;
  queue.status = 'started';
  var run = function run() {
    if (index >= queue.allCount) {
      queue.status = 'finished';
      return;
    }
    var countToRun = queue.limit - queue.runningCount;
    if (countToRun <= 0) return;
    _.each(Array.from({ length: countToRun }), function () {
      var task = null;
      if (!(task = queue.all[++index])) return;
      queue.running.push(task);
      task.run(index).then(function () {
        queue.running = _.filter(queue.running, function (x) {
          return x.index != task.index;
        });
        queue.finished.push(task);
        run();
      });
    });
  };
  run();
};

var Task = function () {
  function Task(queue, promise, index) {
    _classCallCheck(this, Task);

    this.queue = queue;
    this.promise = promise;
    this.index = index;
    this.agent = null;
  }

  _createClass(Task, [{
    key: 'proxy',
    value: function proxy() {
      var _this = this;
      this.agent = new this.queue.Promise(function (resolve, reject) {
        _this.resolve = resolve;
        _this.reject = reject;
      });
      return this.agent;
    }
  }, {
    key: 'run',
    value: function run(index) {
      var _this = this;
      this.promise(index).then(_this.resolve).catch(_this.reject);
      return this.agent;
    }
  }]);

  return Task;
}();

var Queue = function () {
  function Queue(Promise, limit) {
    _classCallCheck(this, Queue);

    this.Promise = Promise;
    this.limit = limit || 1;
    // 所有的任务
    this.all = [];
    // 正在执行的
    this.running = [];
    // 已经完成的
    this.finished = [];
    // unstart}started|finished
    this.status = 'unstart';
  }

  _createClass(Queue, [{
    key: 'wrap',
    value: function wrap(promise) {
      var _this = this;
      if (this.status == 'finished') {
        throw new Error('queue has finished.');
      }
      if (!_.isArray(promise)) {
        throw new Error('promise must be array.');
      }
      promise = _.map(promise, function (x, i) {
        var task = new Task(_this, x, i);
        _this.all.push(task);
        return task.proxy();
      });
      start(this);
      return promise;
    }
  }, {
    key: 'allCount',
    get: function get() {
      return this.all.length;
    }
  }, {
    key: 'runningCount',
    get: function get() {
      return this.running.length;
    }
  }, {
    key: 'finishedCount',
    get: function get() {
      return this.finished.length;
    }
  }]);

  return Queue;
}();

exports.default = Queue;