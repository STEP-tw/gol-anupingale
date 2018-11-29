const { zipper } = require("./gameOfLifeUtil.js");

const isAlive = function(currentGeneration, cell) {
  return currentGeneration.some(element => element[0] == cell[0] && element[1] == cell[1]);
}

const isValid = function(worldSize, neighbour) {
  let {topLeft, bottomRight} = worldSize;
  return neighbour.every(element => element >= topLeft[0] && element <= bottomRight[1]);
}

const extractNeighbours = function(cell, worldSize) {
  let row = [cell[0]-1, cell[0], cell[0]+1];
  let column = [cell[1]-1, cell[1], cell[1]+1];
  let zip = zipper(column);
  let allNeighbours = row.reduce(zip, []);
  allNeighbours.splice(4,1);
  let validateNeighbour = isValid.bind(null, worldSize);
  return allNeighbours.filter(validateNeighbour);
}

const extractAllNeighbours = function(bound){
  let {topLeft, bottomRight} = bound;
  let allNeighbours = {}
  for (let row = topLeft[0]; row<=bottomRight[0];row++) {
    for (let column = topLeft[1]; column<=bottomRight[1];column++) {
      allNeighbours["["+row+", "+column+"]"] = extractNeighbours([row,column],bound); 
    }
  }
  return allNeighbours;
}

const calculateAliveNeighboursOfCell = function(allNeighbours, currentGeneration, cell){
  let numberOfAliveNeighbours = 0;
  let neighboursOfCell = allNeighbours[cell];
  for (let neighbour of neighboursOfCell){
    let alive = isAlive(currentGeneration, neighbour);
    if(alive) { numberOfAliveNeighbours++; }
  }
  return numberOfAliveNeighbours;
}

const calculateAlive = function(allNeighbours, currentGeneration) {
  return function(result, cell) {
    result[cell] = calculateAliveNeighboursOfCell(allNeighbours, currentGeneration, cell);
    return result;
  }
}

const calculateAliveNeighbours = function(allNeighbours, currentGeneration){
  let cells = Object.keys(allNeighbours);
  let countAlive  = calculateAlive(allNeighbours, currentGeneration);
  let neighboursState = cells.reduce(countAlive, {});
  return neighboursState;
}

const varifyRules = function(cell, neighbourCount, currentGeneration){
  let element = JSON.parse(cell);
  if(neighbourCount[cell] == 3){
      return element;
    }
    if(neighbourCount[cell] == 2 && isAlive(currentGeneration,element)) {
      return element;
    }
}
 
const nextGeneration = function(currentGeneration, bound) {
  let allNeighbours = extractAllNeighbours(bound);
  let neighbourCount = calculateAliveNeighbours(allNeighbours, currentGeneration);
  let keys = Object.keys(allNeighbours);
  let aliveCells = [];
  for(let cell of keys){
      aliveCells.push(varifyRules(cell, neighbourCount, currentGeneration));
  }
  return aliveCells.filter(x => x != undefined);
}

module.exports = { nextGeneration };
