//= wrapped

_.mixin({
	formatString: formatString,
  formatStringEx: formatStringEx,
  joinBy: joinBy,
  joinCompact: joinCompact,
  joinCompactBy: joinCompactBy,
  asArray: asArray,
  getterSetter: getterSetter,
  watcher: watcher,
	replaceAll: replaceAll,
  isHex: isHex,
  href: href,
  objectToParams: objectToParams,
  formatFileSize: formatFileSize,
  pickDeep: pickDeep,
  isNamedFunction: isNamedFunction,
  isEqualBy: isEqualBy,
  rgbToHex: rgbToHex,
  findAndGetNext: findAndGetNext,
  findAndGetPrev: findAndGetPrev,
  subString: subString,
	acronym: acronym,
	isjQuery: isjQuery,
  randomInt: randomInt,
  randomFloat: randomFloat,
  randomBool: randomBool,
  isLikeNumber: isLikeNumber,
  hasValue: hasValue,
  or: or,
  compactStrict: compactStrict,
  orStrict: orStrict
});

/**
 * Replaces matching index tokens with value from arguments or array.
 *
 * @static
 * @memberOf _
 * @param {string} format - The string with replacement tokens.
 * @param {...string | string[] | object} tokens - The data used for the tokens to populate the format string.
 * @returns {string} The string with replaced tokens.
 * @example
 * _.formatString('Hallo {0}!', 'Welt') => 'Hallo Welt!'
 */
function formatString(format, tokens) {
  var values = [];

  if(_.isArray(tokens) || _.isObject(tokens)) {
    values = tokens;
  } else {
    values = _.takeRight(arguments, arguments.length - 1);
  }

  _.forEach(values, function(value, key) {
    format = _.replace(format, '{' + key + '}', _.isUndefined(value) ? '' : _.toString(value));
  });

  return format;
}

/**
 * Replaces matches for path tokens surrounded by single curly brackets in string with value from object. See _.get for path usage.
 *
 * @static
 * @memberOf _
 * @param {string} format - The string with replacement tokens.
 * @param {...*} data - The data used for the tokens to populate the format string.
 * @returns {string} The string with replaced tokens.
 * @example
 * _.formatStringEx('Hallo {[0]}!', 'Welt') => 'Hallo Welt!'
 */
function formatStringEx(format, data) {
  if(arguments.length > 2) {
    data = _.takeRight(arguments, arguments.length - 1);
  } else if (!(_.isArray(data) || _.isObject(data))) {
    data = [data];
  }

  return _.replace(format, /{(.+?)}/g, function(match, token) {
    return _.get(data, token);
  });
}


function joinBy(array, separator, iteratee) {
  return _.join(_.map(array, iteratee), separator);
}

function joinCompact(array, separator) {
  return _.join(_.compact(array), separator);
}

function joinCompactBy(array, separator, iteratee) {
  return _.join(_.map(_.compact(array), iteratee), separator);
}

function asArray(value) {
  return _.compact(_.isArray(value) ? value : [value]);
}

/**
 * Creates a ready to use GetSet-Function for ngModels with getterSetter option.
 *
 * @static
 * @memberOf _
 * @param {function} [onSet] - The function callback for setting the value.
 * @param {function} [onGet] - The function callback for getting the value.
 * @param {*|function} [value] - The default value for this GetSet-Function. Can be the value or a function which returns the value.
 * @returns {function} The GetSet-Function.
 */
function getterSetter(onSet, onGet, value) {
  value = (_.isFunction(value) ? value() : value);

  return function getterSetter(newValue) {
    if(arguments.length) {
      value = (_.isFunction(onSet) ? onSet(newValue, value) : newValue);
    }

    return (_.isFunction(onGet) ? onGet(value) : value);
  };
}

function watcher(onGet, onChange, interval, shouldDispose) {
  var lastValue;

  var timerId = setInterval(function() {
    var value = onGet();

    if(_.isFunction(shouldDispose) && shouldDispose()) {
      clearInterval(timerId);
    } else if(lastValue !== value) {
      lastValue = onChange(value, lastValue) || value;
    }
  }, interval || 100);

  return function() {
    clearInterval(timerId);
  };
}

function replaceAll(original, search, replacement) {
  return original.split(search).join(replacement);
}

function isHex(value) {
  return value.match(/^#(?:[0-9a-f]{3}){1,2}$/i);
}

function href(baseUrl, params) {
  var paramString = _.objectToParams(params);
  return baseUrl + (paramString ? '?' + paramString : '');
}

function objectToParams(params) {
  var paramMap = _.compact(_.map(params, function(value, key) {
    return (key && value ? encodeURIComponent(key) + '=' + encodeURIComponent(value) : null);
  }));

  return (paramMap.length ? _.join(paramMap, '&') : '');
}

/**
 * Formats a file size to a more readable string.
 *
 * @static
 * @memberOf _
 * @param {number} bytes - The size of the file in bytes.
 * @param {string} [unit='iec'] - The format of the output.
 * @param {number} [fraction=2] - The fraction of floating numbers
 * @returns {string | undefined} The formatted file size.
 * @example
 * _.formatFileSize(1000000, 'iec'); => '976.56 KiB'
 */
function formatFileSize(bytes, unit, fraction){
  if(_.isNumber(bytes)) {
    var factors = {
      'si': [1024, 'K', 'B'],
      'iec': [1024, 'K', 'iB']
    };

    var factor = factors[_.toLower(unit)] || factors.iec;
    /*jshint -W016 */
    var a = Math.log(bytes) / Math.log(factor[0]) | 0;
    /*jshint +W016 */
    var value = (bytes / Math.pow(factor[0], a));

    return _.formatString('{value} {unit}', {
      value: (a ? value.toFixed(_.isUndefined(fraction) ? 2 : fraction) : value),
      unit: (a ? (factor[1] + 'MGTPEZY')[--a] + factor[2] : 'Bytes')
    });
  }

  return undefined;
}

/**
 * This method is like _.pick except that it recursively retrieves the values.
 *
 * @static
 * @memberOf _
 * @param {object} object - The source object.
 * @param {...(string|string[])} [paths] - The property paths to pick.
 * @returns {object} The new object.
 */
function pickDeep(object, paths) {
  var result = {};

  if(_.isString(paths)) {
    paths = [paths];
  }

  if(_.isArray(paths)) {
    _.forEach(paths, function(path) {
      _.set(result, path, _.get(object, path));
    });
  }

  return result;
}

/**
 * Checks if a function is anonymous.
 *
 * @static
 * @memberOf _
 * @param {function} fn - The function to check.
 * @returns {boolean} Returns false if the function is anonymous, else true.
 */
function isNamedFunction(fn) {
  return _.isFunction(fn) && _.hasValue(fn, 'name');
}

/**
 * Performs a deep comparison between two values from the given property value to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @param {array|object} value - The value to compare.
 * @param {array|object} other - The other value to compare.
 * @param {string} path - The path of the property to compare.
 * @returns {boolean} Returns true if the values are equivalent else false.
 */
function isEqualBy(value, other, path) {
  return _.isEqual(_.get(value, path), _.get(other, path));
}

/**
 * Converts an css rgb color value to hex.
 *
 * @static
 * @memberOf _
 * @param {string} value - The rgb value to convert.
 * @returns {string} The hex string.
 */
function rgbToHex(value) {
  var values = _.map(value.match(/\d+/g), function(value) {
    return _.padStart(parseInt(value, 10).toString(16), 2, '0');
  });

  return values.length > 2 ? formatStringEx('#{[0]}{[1]}{[2]}', values) : undefined;
}

/**
 * Iterates over elements of collection, returning the element after the first element predicate returns truthy for.
 * The predicate is invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @param {array|object} collection  - The collection to inspect.
 * @param {function} [predicate=_.identity] - The function invoked per iteration.
 * @param {number} [fromIndex=0] - The index to search from.
 * @returns {*} Returns the element after the matched element, else undefined.
 */
function findAndGetNext(collection, predicate, fromIndex) {
  return _.get(collection, _.findIndex(collection, predicate, fromIndex) + 1);
}

/**
 * Iterates over elements of collection, returning the element before the first element predicate returns truthy for.
 * The predicate is invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @param {array|object} collection - The collection to inspect.
 * @param {function} [predicate=_.identity] - The function invoked per iteration.
 * @param {number} [fromIndex=0] - The index to search from.
 * @returns {*} Returns the element before the matched element, else undefined.
 */
function findAndGetPrev(collection, predicate, fromIndex) {
  return _.get(collection, _.findIndex(collection, predicate, fromIndex) - 1);
}


/**
 * This method extracts the characters in a string between "start" and "end", not including "end" itself.
 * If "start" is greater than "end", this method will swap the two arguments, meaning _.subString(string, 1, 4) == _.subString(string, 4, 1).
 * If either "start" or "stop" is less than 0, it is treated as if it were 0.
 *
 * @static
 * @memberOf _
 * @param {string} string - The string to extract the characters.
 * @param {number} [start=0] - The position where to start the extraction. First character is at index 0.
 * @param {number} [end=string.length] - The position where to start the extraction. First character is at index 0.
 * @returns {string} A new String containing the extracted characters.
 */
function subString(string, start, end) {
  return _.isString(string) ? string.substring(start, end) : undefined;
}

function acronym(string) {
  return string ? string.match(/\b(\w)/g).join('') : undefined;
}

/**
 * Checks if the given object is a jQuery object.
 *
 * @static
 * @memberOf _
 * @param {Object} object - The object to check.
 * @returns {number} Returns true if the object was an jQuery object, else false.
 */
function isjQuery(object) {
  return (object && (object instanceof jQuery || object.constructor.prototype.jquery));
}

/**
 * Creates a random float between min and max.
 *
 * @static
 * @memberOf _
 * @param {number} [min=0] - The minimum value.
 * @param {number} [max=1] - The maximum value.
 * @returns {number} Returns the random float between min and max.
 */
function randomFloat(min, max) {
  min = _.isNumber(min) ? min : 0;
  max = _.isNumber(max) ? max : 1;
  return min + (Math.random() * (max - min));
}

/**
 * Creates a random integer between min and max.
 *
 * @static
 * @memberOf _
 * @param {number} [min=0] - The minimum value.
 * @param {number} [max=1] - The maximum value.
 * @returns {number} Returns the random integer between min and max.
 */
function randomInt(min, max) {
  return Math.round(randomFloat(min, max));
}

/**
 * Creates a random boolean.
 *
 * @static
 * @memberOf _
 * @returns {boolean} Returns true or false.
 */
function randomBool() {
  return Math.round(Math.random()) > 0;
}

/**
 * Checks if a string can be fully converted into a number.
 *
 * @static
 * @memberOf _
 * @param {string} value - The string to check.
 * @returns {boolean} Returns true if the string can be converted, else false.
 */
function isLikeNumber(value) {
  /*jshint -W116 */
  return value == parseFloat(value);
  /*jshint +W116 */
}

/**
 * Checks if path is a direct property of object and has an value other than undefined.
 *
 * @static
 * @memberOf _
 * @param {Object} object - The object to query.
 * @param {Array|string} path - The path to check.
 * @returns {boolean} Returns true if path exists and has an value, else false.
 */
function hasValue(object, path) {
  return !_.isUndefined(_.get(object, path));
}

/**
 * Returns the first object which is not falsey. The values `null`, `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @param {...*|Array} array - The array to query.
 * @returns {boolean} Returns the first element which is not falsey, `undefined` if there is none.
 */
function or(array) {
  return  _.first(_.compact(_.isArray(array) ? array : arguments));
}

/**
 * Returns the first object which is not nullish. The values null and `undefined` and `nullish`.
 *
 * @static
 * @memberOf _
 * @param {...*|Array} array - The array to query.
 * @returns {boolean} Returns the first element which is not nullish, undefined if there is none.
 */
function orStrict(array) {
  return  _.first(_.compactStrict(_.isArray(array) ? array : arguments));
}

/**
 * Creates an array with all nullish values removed. The values `undefined` and `nullish` are falsey.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, undefined, 2, '', 3, Null]);
 * // => [0, 1, false, 2 '', 3]
 */
function compactStrict(array) {
  var index = -1,
    length = array ? array.length : 0,
    resIndex = 0,
    result = [];

  while (++index < length) {
    var value = array[index];
    if (!_.isNil(value)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
