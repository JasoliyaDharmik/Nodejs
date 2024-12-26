const crypto = require("node:crypto");
console.log("Hello world");

var a = 343433;
var b = 2045;

crypto.pbkdf2Sync("Password@123", "salt", 5000000, 50, "sha512");
console.log("First key is generated!");

setTimeout(() => {
  console.log("Inside timeout call now!!");
}, 0);

crypto.pbkdf2("Password@123", "salt", 5000000, 50, "sha512", (error, key) => {
  console.log("Second key is generated");
});
function multiply(a, b) {
  return a * b;
}

console.log("Multiplication value: " + multiply(a, b));
