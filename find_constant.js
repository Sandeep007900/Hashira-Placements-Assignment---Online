// find_constant_any_base.js
const fs = require("fs");

// Read JSON from file (arg) or stdin
const s = process.argv[2]
  ? fs.readFileSync(process.argv[2], "utf8")
  : fs.readFileSync(0, "utf8");

const j = JSON.parse(s);
const m = j.keys.k - 1;

// Digit value helper
const digitVal = (ch) => {
  if (ch >= "0" && ch <= "9") return ch.charCodeAt(0) - 48;
  if (ch >= "a" && ch <= "z") return 10 + ch.charCodeAt(0) - 97;
  if (ch >= "A" && ch <= "Z") return 10 + ch.charCodeAt(0) - 65;
  return -1;
};

// Convert string in base b → BigInt decimal
const parseInBase = (val, base) => {
  let r = 0n;
  let neg = false;
  let str = val.trim();
  if (str[0] === "-") {
    neg = true;
    str = str.slice(1);
  }
  for (let ch of str) {
    let d = digitVal(ch);
    if (d < 0 || d >= base) {
      console.error(`Invalid digit '${ch}' for base ${base} in value "${val}"`);
      process.exit(1);
    }
    r = r * BigInt(base) + BigInt(d);
  }
  return neg ? -r : r;
};

// Collect all roots (exclude "keys")
const ks = Object.keys(j)
  .filter((k) => k !== "keys")
  .sort((a, b) => +a - +b);

console.log("All roots converted to decimal:");
let roots = [];
for (let k of ks) {
  let o = j[k];
  let dec = parseInBase(o.value, +o.base);
  console.log(`${k}: (base ${o.base}) ${o.value} -> ${dec}`);
  roots.push(dec);
}

// Compute constant term using first m roots
if (roots.length < m) {
  console.error(`Need ${m} roots but found only ${roots.length}`);
  process.exit(1);
}
let prod = 1n;
for (let i = 0; i < m; i++) prod *= roots[i];
if (m % 2) prod = -prod;

console.log("\nConstant term (c) = (-1)^m * product of first m roots:");
console.log(prod.toString());
