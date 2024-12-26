const fs = require("fs");

setImmediate(() => console.log('setImmediate'));

setTimeout(() => console.log('setTimeout'), 0);

Promise.resolve("resolve").then(() => console.log("Promise"));

fs.readFile("./file.txt", "utf8", () => {
  setTimeout(() => console.log('2nd setTimeout'), 0);

  process.nextTick(() => console.log('2nd process.nextTick'));

  setImmediate(() => console.log('2nd setImmediate'));

  console.log("File reading.");
});

process.nextTick(() => console.log('process.nextTick'));

console.log("Last line of the file");

// Last line of the file
// process.nextTick
// Promise
// setTimeout
// setImmediate
// File reading.
// 2nd process.nextTick
// 2nd setImmediate
// 2nd setTimeout