
Promise.prototype['finally'] = function (onResolveOrReject) {
  return this['catch'](function (result) {
    return result;
  }).then(onResolveOrReject);
};

if (Promise.queue === undefined) {
  Promise.queue = function (queue) {
    'use strict';
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
        var promise = callFun();
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
  Object.assign = function(target) {
    'use strict';
    if (target === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source !== null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this === null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}
