


const CENTER_X = 300;
const CENTER_Y = 300;
const SVG_BOX = 600;
const RADIUS = 280;
const SEGMENTS = 20;

const TURNS = 5;

const R1 = RADIUS * 0.23;
const R2 = R1+10;


const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const INC = 1296;

const ANCHOR = -3102;
const ANCHOR_CELL = 34;

// month map
const MONTH_MAP = {
  0: "JAN",
  1: "FEB",
  2: "MAR",
  3: "APR",
  4: "MAY",
  5: "JUN",
  6: "JUL",
  7: "AUG",
  8: "SEP",
  9: "OCT",
  10: "NOV",
  11: "DEC"
}

// name amp
const YUGA_NAME_MAP = {
  GU: "Golden Age ↑",
  GD: "Golden Age ↓",
  SD: "Silver Age ↓",
  BD: "Bronze Age ↓",
  ID: "Iron Age ↓",
  IU: "Iron Age ↑",
  BU: "Bronze Age ↑",
  SU: "Silver Age ↑",
}

// journey map
const JOURNEY_MAP = {
  GU: "G↑",
  GD: "G↓",
  SD: "S↓",
  BD: "B↓",
  ID: "I↓",
  IU: "I↑",
  BU: "B↑",
  SU: "S↑",
}



const GOLDEN_COLOR = "rgba(255, 215, 0, 0.2)";
const SILVER_COLOR = "rgba(192, 192, 192, 0.2)";
const BRONZE_COLOR = "rgba(205, 127, 50, 0.2)";
const IRON_COLOR = "rgba(255, 255, 255, 0)";

const GOLDEN_COLOR_SOLID = "rgb(255, 215, 0)";
const SILVER_COLOR_SOLID = "rgb(192, 192, 192)";
const BRONZE_COLOR_SOLID = "rgb(205, 127, 50)";
const IRON_COLOR_SOLID = "rgb(255, 255, 255)";

// convert below aray to rgba array
const YUGA_SCALE_COLOR = ["rgba(255, 0, 0, 0.3)", "rgba(255, 165, 0, 0.3)", "rgba(255, 255, 0, 0.3)", "rgba(0, 128, 0, 0.3)", "rgba(0, 0, 255, 0.3)", "rgba(128, 0, 128, 0.3)"];
// const YUGA_SCALE_COLOR = [red, orange, yellow, green, blue, violet]
const JOURNEY_TAG = ["b_1", "b_10", "b_100", "b_1_000", "b_10_000", "b_100_000"];
const getTag = (num) => {
  let acc = 0;
  for (let n=num;n>=10;n /= 10, acc += 1);
  console.log("GET TAG \n.   acc: " , acc, "journey: ", JOURNEY_TAG[acc]);
  return JOURNEY_TAG[acc];
}

const JOURNEY = {
  b_1: { age: "", yr: "", cell: 0},
  b_10: { age: "", yr: "", cell: 0},
  b_100: { age: "", yr: "", cell: 0},
  b_1_000: { age: "", yr: "", cell: 0},
  b_10_000: { age: "", yr: "", cell: 0},
  b_100_000: { age: "", yr: "", cell: 0},
}



function formatToString(num, fix = 3) {
  // caling Number() removes decimal 00 in num representations
  return num ? Number(num.toFixed(fix)).toString(): "...";
}


const getYugaSvgData = (age) => {
  let up, down, segs, fill;
  switch (age) {
    case "golden-age":
      segs = 4;
      up = 1;
      down = 5;
      fill = GOLDEN_COLOR;
      break;
    case "silver-age":
      segs = 3;
      up = 18;
      down = 9;
      fill = SILVER_COLOR;
      break;
    case "bronze-age":
      segs = 2;
      up = 16;
      down = 12;
      fill = BRONZE_COLOR;
      break;
    case "iron-age":
      segs = 1;
      up = 15;
      down = 14;
      fill = IRON_COLOR;
      break;
    default:
      fill = "rgba(255, 255, 255, 1)"
      break;
  }
  return {up, down, segs, fill};
}


const getDate = (yr) => {
  const d = yr % 1;
  const mi = d * 12;
  const date = (mi % 1) * 30;
  const month = MONTH_MAP[parseInt(mi).toString()];
  return {month, date, mi};
}

const getCellAge = (index) => {
  let k = index % 20;
  let age;
  if (k >= 1 && k < 5) age = "GU";
  else if (k >= 5 && k < 9) age = "GD";
  else if (k >= 9 && k < 12) age = "SD";
  else if (k >= 12 && k < 14) age = "BD";
  else if (k == 14) age = "ID";
  else if (k == 15) age = "IU";
  else if (k >= 16 && k < 18) age = "BU";
  else if ((k >= 18) || (k < 1)) age = "SU";
  return age;
}
  

export { MONTH_MAP, YUGA_NAME_MAP, JOURNEY_MAP, JOURNEY_TAG, JOURNEY, GOLDEN_COLOR, SILVER_COLOR, BRONZE_COLOR, IRON_COLOR, GOLDEN_COLOR_SOLID, SILVER_COLOR_SOLID, BRONZE_COLOR_SOLID, IRON_COLOR_SOLID, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, INC, ANCHOR, ANCHOR_CELL, TURNS, SEGMENTS, CENTER_X, CENTER_Y, SVG_BOX, RADIUS, R1, R2, YUGA_SCALE_COLOR, getYugaSvgData, getTag, formatToString, getDate, getCellAge };