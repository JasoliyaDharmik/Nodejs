const fs = require("fs");
const a = 100;

setImmediate(() => console.log('setImmediate'));

Promise.resolve("resolve").then(() => console.log("Promise"));

fs.readFile("./file.txt", "utf8", () => {
  console.log("File reading.");
});

setTimeout(() => console.log('setTimeout'), 0);

process.nextTick(() => console.log('process.nextTick'));

function printA() {
  console.log("a=" + a);
}

printA();

console.log("Last line of the file");

// a=100
// Last line of the file
// process.nextTick
// Promise
// setTimeout
// setImmediate
// File reading.