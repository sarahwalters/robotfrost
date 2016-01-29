var generalUtils = {};

generalUtils.addIfUnique = function(array, element) {
  if (array && element && array.indexOf(element) === -1) {
    array.push(element);
  }
};

generalUtils.addToArrayMap = function(arrayMap, key, value) {
  if (arrayMap.hasOwnProperty(key) && arrayMap[key].indexOf(value) === -1) {
    arrayMap[key].push(value);
  } else {
    arrayMap[key] = [value];
  }
};

module.exports = generalUtils;
