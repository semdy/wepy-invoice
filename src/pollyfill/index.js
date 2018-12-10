'use strict'

if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (onResolveOrReject) {
    return this.catch(function (result) {
      return result
    }).then(onResolveOrReject)
  }
}

if (!Promise.queue) {
  Promise.queue = function (queue) {
    'use strict'
    if (!Array.isArray(queue)) {
      throw new TypeError('arguments must be a array')
    }
    var queueIndex = 0
    var returnPool = []
    var queueHandler = function (resolve, reject) {
      if (queueIndex > queue.length - 1) {
        return resolve(returnPool)
      }
      var callFun = queue[queueIndex]
      if (!(callFun instanceof Function)) {
        reject('argument ' + queueIndex + ' is not a Function')
      } else {
        var promise = callFun()
        if (!(promise instanceof Promise)) {
          reject('argument ' + queueIndex + ' is not return a Promise instance')
        } else {
          promise.then(function (res) {
            queueIndex++
            returnPool.push(res)
            queueHandler(resolve, reject)
          }, function (obj) {
            reject(obj)
          })
        }
      }
    }
    return new Promise(queueHandler)
  }
}

if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    'use strict'
    if (target === null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    target = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index]
      if (source !== null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }
}

if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty
    var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString')
    var dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ]
    var dontEnumsLength = dontEnums.length

    return function (obj) {
      if (typeof obj !== 'object' || typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

      var result = []

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop)
      }

      if (hasDontEnumBug) {
        for (var i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
        }
      }
      return result
    }
  })()
}

if (!Object.values) {
  Object.values = function (obj) {
    if (obj !== Object(obj)) {
      throw new TypeError('Object.values called on a non-object')
    }
    var val = []
    var key
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        val.push(obj[key])
      }
    }
    return val
  }
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this === null) {
        throw new TypeError('"this" is null or not defined')
      }

      var o = Object(this)

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }

      // 4. If thisArg was supplied, let T be thisArg else let T be undefined.
      var thisArg = arguments[1]

      // 5. Let k be 0.
      var k = 0

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k]
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue
        }
        // e. Increase k by 1.
        k++
      }

      // 7. Return undefined.
      return undefined
    }
  })
}

if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this === null) {
        throw new TypeError('"this" is null or not defined')
      }

      var o = Object(this)

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }

      // 4. If thisArg was supplied, let T be thisArg else let T be undefined.
      var thisArg = arguments[1]

      // 5. Let k be 0.
      var k = 0

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k]
        if (predicate.call(thisArg, kValue, k, o)) {
          return k
        }
        // e. Increase k by 1.
        k++
      }

      // 7. Return undefined.
      return -1
    }
  })
}

if (!Array.prototype.reduce) {
  Object.defineProperty(Array.prototype, 'reduce', {
    value: function (callback /* , initialValue */) {
      if (this === null) {
        throw new TypeError('Array.prototype.reduce ' +
          'called on null or undefined')
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback +
          ' is not a function')
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this)

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0

      // Steps 3, 4, 5, 6, 7
      var k = 0
      var value

      if (arguments.length >= 2) {
        value = arguments[1]
      } else {
        while (k < len && !(k in o)) {
          k++
        }

        // 3. If len is 0 and initialValue is not present,
        //    throw a TypeError exception.
        if (k >= len) {
          throw new TypeError('Reduce of empty array ' +
            'with no initial value')
        }
        value = o[k++]
      }

      // 8. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kPresent be ? HasProperty(O, Pk).
        // c. If kPresent is true, then
        //    i.  Let kValue be ? Get(O, Pk).
        //    ii. Let accumulator be ? Call(
        //          callbackfn, undefined,
        //          « accumulator, kValue, k, O »).
        if (k in o) {
          value = callback(value, o[k], k, o)
        }

        // d. Increase k by 1.
        k++
      }

      // 9. Return accumulator.
      return value
    }
  })
}

if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function (value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined')
      }

      var O = Object(this)

      // Steps 3-5.
      var len = O.length >>> 0

      // Steps 6-7.
      var start = arguments[1]
      var relativeStart = start >> 0

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len)

      // Steps 9-10.
      var end = arguments[2]
      var relativeEnd = end === undefined ?
        len : end >> 0

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len)

      // Step 12.
      while (k < final) {
        O[k] = value
        k++
      }

      // Step 13.
      return O
    }
  })
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    var k
    if (this == null) {
      throw new TypeError('"this" is null or not defined')
    }

    var O = Object(this)
    var len = O.length >>> 0

    if (len === 0) {
      return -1
    }

    var n = +fromIndex || 0

    if (Math.abs(n) === Infinity) {
      n = 0
    }

    if (n >= len) {
      return -1
    }

    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)

    while (k < len) {
      if (k in O && O[k] === searchElement) {
        return k
      }
      k++
    }
    return -1
  }
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function () {
    return this.indexOf.apply(this, arguments) > -1
  }
}

if (!Array.prototype.some) {
  Array.prototype.some = function (fun /* , thisArg */) {
    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined')
    }

    if (typeof fun !== 'function') {
      throw new TypeError()
    }

    var t = Object(this)
    var len = t.length >>> 0

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true
      }
    }

    return false
  }
}

if (!Array.prototype.every) {
  Array.prototype.every = function (fun /*, thisArg */) {
    if (this === void 0 || this === null) {
      throw new TypeError()
    }

    var t = Object(this)
    var len = t.length >>> 0
    if (typeof fun !== 'function') {
      throw new TypeError()
    }

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0
    for (var i = 0; i < len; i++) {
      if (i in t && !fun.call(thisArg, t[i], i, t)) {
        return false
      }
    }

    return true
  }
}

if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]'
    }
    var toInteger = function (value) {
      var number = Number(value)
      if (isNaN(number)) {
        return 0
      }
      if (number === 0 || !isFinite(number)) {
        return number
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number))
    }
    var maxSafeInteger = Math.pow(2, 53) - 1
    var toLength = function (value) {
      var len = toInteger(value)
      return Math.min(Math.max(len, 0), maxSafeInteger)
    }

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike)

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined')
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined
      var T
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function')
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2]
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length)

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len)

      // 16. Let k be 0.
      var k = 0
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue
      while (k < len) {
        kValue = items[k]
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k)
        } else {
          A[k] = kValue
        }
        k += 1
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len
      // 20. Return A.
      return A
    }
  }())
}

if (!Array.isArray) {
  Array.isArray = function (array) {
    return Object.prototype.toString.call(array) === '[object Array]'
  }
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0
    return this.substr(position, searchString.length) === searchString
  }
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString()
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length
    }
    position -= searchString.length
    var lastIndex = subjectString.lastIndexOf(searchString, position)
    return lastIndex !== -1 && lastIndex === position
  }
}

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict'
    if (typeof start !== 'number') {
      start = 0
    }
    if (start + search.length > this.length) {
      return false
    } else {
      return this.indexOf(search, start) !== -1
    }
  }
}

if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) {
    if (this === null) {
      throw new TypeError('can\'t convert ' + this + ' to object')
    }
    var str = '' + this
    count = +count
    if (count !== count) {
      count = 0
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative')
    }
    if (count === Infinity) {
      throw new RangeError('repeat count must be less than infinity')
    }
    count = Math.floor(count)
    if (str.length === 0 || count === 0) {
      return ''
    }
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size')
    }
    var rpt = ''
    for (var i = 0; i < count; i++) {
      rpt += str
    }
    return rpt
  }
}
