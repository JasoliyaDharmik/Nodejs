const fs = require("fs");

setImmediate(() => console.log('setImmediate'));

setTimeout(() => console.log('setTimeout'), 0);

Promise.resolve("resolve").then(() => console.log("Promise"));

fs.readFile("./file.txt", "utf8", () => {
  console.log("File reading.");
});

process.nextTick(() => {
  process.nextTick(() => console.log('inner process.nextTick'));
  console.log('process.nextTick');
});

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