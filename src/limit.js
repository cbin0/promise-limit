const _ = require('lodash')

let start = function(queue) {
  let index = -1
  if(queue.status == 'started') return
  queue.status = 'started'
  let run = () => {
    if(index >= queue.allCount) {
      queue.status = 'finished'
      return
    }
    let countToRun = queue.limit - queue.runningCount
    if(countToRun <= 0) return
    _.each(Array.from({ length: countToRun }), () => {
      let task = null
      if(!(task = queue.all[++index])) return
      queue.running.push(task)
      task.run(index).then(() => {
        queue.running = _.filter(queue.running, (x) => {
          return x.index != task.index
        })
        queue.finished.push(task)
        run()
      })
    })
  }
  run()
}

class Task {
  constructor(queue, promise, index) {
    this.queue = queue
    this.promise = promise
    this.index = index
    this.agent = null
  }

  proxy() {
    let _this = this
    this.agent = new this.queue.Promise((resolve, reject) => {
      _this.resolve = resolve
      _this.reject = reject
    })
    return this.agent
  }

  run(index) {
    let _this = this
    this.promise(index).then(_this.resolve).catch(_this.reject)
    return this.agent
  }
}

export default class Queue {

  constructor(Promise, limit) {
    this.Promise = Promise
    this.limit = limit || 1
    // 所有的任务
    this.all = []
    // 正在执行的
    this.running = []
    // 已经完成的
    this.finished = []
    // unstart}started|finished
    this.status = 'unstart'
  }

  wrap(promise) {
    let _this = this
    if(this.status == 'finished') {
      throw new Error('queue has finished.')
    }
    if(!_.isArray(promise)) {
      throw new Error('promise must be array.')
    }
    promise = _.map(promise, (x, i) => {
      let task = new Task(_this, x, i)
      _this.all.push(task)
      return task.proxy()
    })
    start(this)
    return promise
  }

  get allCount() {
    return this.all.length
  }

  get runningCount() {
    return this.running.length
  }

  get finishedCount() {
    return this.finished.length
  }
}
