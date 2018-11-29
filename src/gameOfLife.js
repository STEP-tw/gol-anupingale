const { zipper } = require("./gameOfLifeUtil.js");

const isAlive = function(currentGeneration, cell) {
  return currentGeneration.some(element => element[0] == cell[0] && element[1] == cell[1]);
}

const isValid = function(worldSize, neighbour) {
  let {topLeft, bottomRight} = worldSize;
  let case1 = topLeft[0] <= neighbour[0] && neighbour[0] <= bottomRight[0];
  let case2 = neighbour[1] >= topLeft[1] && neighbour[1] <= bottomRight[1];
  return case1 && case2;
}

const extractNeighbours = function(worldSize) {
  return function(result, cell) {
  let position = JSON.parse(cell);
  let row = [position[0]-1, position[0], position[0]+1];
  let column = [position[1]-1, position[1], position[1]+1];
  let zip = zipper(column);
  let allNeighbours = row.reduce(zip, []);
  allNeighbours.splice(4,1);
  let validateNeighbour = isValid.bind(null, worldSize);
  result[cell] = allNeighbours.filter(validateNeighbour);
  return result;
  }
}

const initWorld = function(bound) {
  let {topLeft, bottomRight} = bound;
  let world = {};
  for (let row = topLeft[0]; row <= bottomRight[0];row++) {
    for (let column = topLeft[1]; column <= bottomRight[1];column++) {
      world["["+row+", "+column+"]"] = 0;
    }
  }
  return world;
}

const countAliveNeighbours = function(allNeighbours, currentGeneration){
  return function(result, cell) {
    let neighbourCount = 0;
    let neighbours = allNeighbours[cell];
    for (let neighbour of neighbours){
      let alive = isAlive(currentGeneration, neighbour) && neighbourCount++; 
    }
    result[cell] = neighbourCount;
    return result;
  }
}

const verifyRules = function(neighbourCount, currentGeneration, cell){
  let element = JSON.parse(cell);
  if(neighbourCount[cell] == 3){
      return element;
    }
    if(neighbourCount[cell] == 2 && isAlive(currentGeneration,element)) {
      return element;
    }
}
 
const nextGeneration = function(currentGeneration, bound) {
  let keys = Object.keys(initWorld(bound));
  let extract = extractNeighbours(bound);
  let neighbours = keys.reduce(extract, {});
  let countAlive  = countAliveNeighbours(neighbours, currentGeneration);
  let neighbourCount = keys.reduce(countAlive, {});
  let verify = verifyRules.bind(null,neighbourCount,currentGeneration);
  return keys.map(verify).filter(x => x != undefined);
}

module.exports = { nextGeneration };
