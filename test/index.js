"use strict"

const assert = require('assert')
const Promise = require('bluebird')
const limit = require('../index')

describe('#queue', () => {
  it('应该限制最大执行量3', (done) => {
    let queue = limit.create(Promise, 3)
    Promise.all(queue.wrap([
      (index) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 1200)
        })
      },
      (index) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 100)
        })
      },
      (index) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 900)
        })
      },
      (index) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 600)
        })
      },
      (index) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 1100)
        })
      }
    ])).then(() => {
      done()
    }).catch((e) => {
      throw e
    })
    setTimeout(() => {
      assert.equal(queue.runningCount, 3)
      assert.equal(queue.finishedCount, 1)
    }, 500)
    setTimeout(() => {
      assert.equal(queue.runningCount, 3)
      assert.equal(queue.finishedCount, 2)
    }, 800)
    setTimeout(() => {
      assert.equal(queue.runningCount, 2)
      assert.equal(queue.finishedCount, 3)
    }, 1000)
    setTimeout(() => {
      assert.equal(queue.runningCount, 1)
      assert.equal(queue.finishedCount, 4)
    }, 1300)
  })
})
