import Limit from './limit'

export default {
  create (Promise, limit) {
    return new Limit(Promise, limit)
  }
}
