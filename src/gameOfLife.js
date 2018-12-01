const { zipper, coordinateGenerator } = require("./gameOfLifeUtil.js");

const createAdjacentNumber = function(number) {
  return [number-1,number,number+1];
}

const isAlive = function(currentGeneration, cell) {
  return currentGeneration.some(element => element[0] == cell[0] && element[1] == cell[1]);
}

const validateNeighbour = function(worldSize) {
  return function(neighbour){
    let {topLeft, bottomRight} = worldSize;
    let verifyRow = topLeft[0] <= neighbour[0] && neighbour[0] <= bottomRight[0];
    let verifyCol = neighbour[1] >= topLeft[1] && neighbour[1] <= bottomRight[1];
    return verifyRow && verifyCol;
  }
}

const extractNeighbours = function(worldSize) {
  return function(result, cell) {
    let position = JSON.parse(cell);
    let adjacentRow = createAdjacentNumber(position[0]);     
    let adjacentCol = createAdjacentNumber(position[1]); 
    let allNeighbours = adjacentRow.reduce(zipper(adjacentCol),[]);
    allNeighbours.splice(4,1);
    result[cell] = allNeighbours.filter(validateNeighbour(worldSize));
    return result;
  }
}

const initWorld = function(bound) {
  let {topLeft, bottomRight} = bound;
  let rowCoordinates = coordinateGenerator(topLeft[0],bottomRight[0]);
  let colCoordinates = coordinateGenerator(topLeft[1],bottomRight[1]);
  let cells = rowCoordinates.reduce(zipper(colCoordinates),[]);
  return cells.reduce((result,cell) => { result['['+cell+']']="D"; return result}, {});
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
  let neighbours = keys.reduce(extractNeighbours(bound), {});
  let countAlive = countAliveNeighbours(neighbours, currentGeneration);
  let neighbourCount = keys.reduce(countAlive, {});
  let verify = verifyRules.bind(null,neighbourCount,currentGeneration);
  return keys.map(verify).filter(x => x != undefined);
}

module.exports = { nextGeneration };
