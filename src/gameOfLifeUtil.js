const zipper = function(column) {
  return function(result, row) {
    for(element of column) {
      result.push([row, element]);
    }
    return result;
  }
}

module.exports = { zipper };
