## Promise-limit

Limit parallel count when all & map ..

### usage
```js
var limit = require('promise-limit');
// any Promise lib, eg bluebird
var Promise = require('bluebird');
/*
  param:
    1. Promise
    2. count to limit tasks running
*/
queue = limit.create(Promise, 2);
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
      setTimeout(resolve, 300)
    })
  }
]))
// task 3 will start after 100ms, all task finished in 1200ms
```
