const assert = require('assert');
const { nextGeneration } = require("../src/gameOfLife.js");
const contains = (list,element) => list.some(e=>e[0]===element[0] && e[1]===element[1]);
const isSame = (actualList,expectedList) => actualList.every(contains.bind(null,expectedList));
const isSameArity = (actualList,expectedList) => actualList.length == expectedList.length;

describe('nextGeneration',() => {
  it('should generate an empty generation for a current generation that contains only one live cell',() => {
    let currentGeneration = [[0,1]];
    let bounds = {topLeft: [0,0], bottomRight: [3,3]};
    let actualNextGen = nextGeneration(currentGeneration,bounds);
    assert.deepEqual(actualNextGen,[]);
  });

  it('should generate a vertical blinker as the next step of a horizontal blinker',() => {
    let currentGeneration = [[0,1],[1,1],[2,1]];
    let expectedNextGen = [[1,0],[1,1],[1,2]]
    let bounds = {topLeft: [0,0], bottomRight: [3,3]};
    let actualNextGen = nextGeneration(currentGeneration,bounds);
    assert.ok(isSame(actualNextGen,expectedNextGen));
    assert.ok(isSameArity(actualNextGen,expectedNextGen));
  });

  it('should kill cells not within bounds',() => {
    let currentGeneration = [[0,1],[0,2],[0,3]];
    let expectedNextGen = []
    let bounds = {topLeft: [1,1], bottomRight: [3,3]};
    let actualNextGen = nextGeneration(currentGeneration,bounds);
    assert.ok(isSame(actualNextGen,expectedNextGen));
    assert.ok(isSameArity(actualNextGen,expectedNextGen));
  });

  it("should return an verical blinker when given horizontal blinker with negative coordinates", () => {
    let currentGeneration = [[0, 0], [0, 1], [0, 2]];
    let expectedNextGen = [[-1,1], [0,1], [1, 1]];
    let bounds = {topLeft: [-1, -1], bottomRight: [2, 2]};
    let actualNextGen = nextGeneration(currentGeneration, bounds);
    assert.ok(isSame(actualNextGen, expectedNextGen));
    assert.ok(isSameArity(actualNextGen, expectedNextGen));
  });

  it("should return an empty generation for a current generation that contains only one live cell", () => {
    let currentGeneration = [[-3,-1],[-2,-5],[1,0],[-1,-1]];
    let expectedNextGen = [];
    let bounds = {topLeft: [-2, -2], bottomRight: [0,0]};
    let actualNextGen = nextGeneration(currentGeneration, bounds);
    assert.ok(isSame(actualNextGen, expectedNextGen));
    assert.ok(isSameArity(actualNextGen, expectedNextGen));
  });

  it("should return a generation with two horizontal alive cells", () => {
    let currentGeneration = [[0,2],[0, 3],[2,2]];
    let expectedNextGen = [[1,2],[1,3]];
    let bounds = {topLeft: [0, 0], bottomRight: [2,3]};
    let actualNextGen = nextGeneration(currentGeneration, bounds);
    assert.ok(isSame(actualNextGen, expectedNextGen));
    assert.ok(isSameArity(actualNextGen, expectedNextGen));
  });

  it('should return the same generation',() => {
    let currentGeneration = [[1,2],[2,1],[2,3],[3,2]];
    let expectedNextGen = [[1,2],[2,1],[2,3],[3,2]]
    let bounds = {topLeft: [0,0], bottomRight: [4,4]};
    let actualNextGen = nextGeneration(currentGeneration,bounds);
    assert.ok(isSame(actualNextGen,expectedNextGen));
    assert.ok(isSameArity(actualNextGen,expectedNextGen));
  });

  it('should return the same generation',() => {
    let currentGeneration = [[2,3],[2,4],[3,2],[3,5],[4,3],[4,4]];
    let expectedNextGen = [[2,3],[2,4],[3,2],[3,5],[4,3],[4,4]];
    let bounds = {topLeft: [1,1], bottomRight: [5,6]};
    let actualNextGen = nextGeneration(currentGeneration,bounds);
    assert.ok(isSame(actualNextGen,expectedNextGen));
    assert.ok(isSameArity(actualNextGen,expectedNextGen));
  });
});

describe("should return generation " ,function(){
  it("behive",function(){
    assert.deepEqual(nextGeneration([[1,2],[1,3],[2,1],[2,4],[3,2],[3,3]],{topLeft:[-10,-3],bottomRight:[4,5]}),[[1,2],[1,3],[2,1],[2,4],[3,2],[3,3]]);});

});
