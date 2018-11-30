const zipper = function(column) {
  return function(result, row) {
    for(element of column) {
      result.push([row, element]);
    }
    return result;
  }
}

const coordinateGnerator = function(startingIndex, endingIndex) {
  let indexex = [];
  for(let index = startingIndex; index <= endingIndex; index++) {
    indexex.push(index);
  }
  return indexex;
}

module.exports = { zipper };
