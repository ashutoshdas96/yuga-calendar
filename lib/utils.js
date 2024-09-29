
const YR_OFFSET = 1_000_000_000;

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
const SEG_DEG = 18;
const SEG_RAD = Math.PI / 10;

const ANCHOR = -3102;
const ANCHOR_CELL = 29;

const GOLDEN_ANCHOR = 20;
const IRON_ANCHOR = 30;

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

//                    0        1        2       3        4         5        6
const YUGA_SCALE = ["Base",  "B/10", "B/100", "B/1K", "B/10K", "B/100K", "B/1M"];
const YUGA_TAG   = ["b_1", "b_10", "b_100", "b_1k", "b_10k", "b_100k"];
const getTag = (fac) => {
  return YUGA_TAG[Math.log10(fac)];
}



function formatToString(num, fix = 3) {
  // caling Number() removes decimal 00 in num representations
  return num ? Number(num.toFixed(fix)).toString(): "...";
}

const jsToYugaDeg = (jsA) => {
  let yA = -jsA - 90;
  return yA < 0 ? 360 + yA : yA;
}

const yugaToJsDeg = (yA) => {
  let jsA = -yA - 90;
  return jsA < -360 ? 360 + jsA : jsA;
}

const jsToYugaRad = (jsA) => {
  let yA = -jsA - Math.PI/2;
  return yA < 0 ? 2*Math.PI + yA : yA;
}

const yugaToJsRad = (yA) => {
  let jsA = -yA - Math.PI/2;
  return jsA < -2*Math.PI ? 2*Math.PI + jsA : jsA;
}

const radToDeg = (rad) => {
  return rad * 180 / Math.PI;
}

const degToRad = (deg) => {
  return deg * Math.PI / 180;
}

const yugaINDeg = (angle) => {
  const seg = parseInt(angle / SEG_DEG);
  return seg % 2 ? (angle % SEG_DEG) * 10 + 180 : (angle % SEG_DEG) * 10;
}

const yugaINRad = (angle) => {
  const seg = parseInt(angle / SEG_RAD);
  return seg % 2 ? (angle % SEG_RAD) * 10 + Math.PI : (angle % SEG_RAD) * 10;
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
  // using offset to handle -ve years
  const offYear = YR_OFFSET + yr;
  const d = offYear % 1;
  const mi = d * 12;
  const date = (mi % 1) * 30;
  const month = MONTH_MAP[parseInt(mi).toString()];
  const year = offYear - YR_OFFSET;
  return {
    month,
    date,
    year: year < 0 ? `${parseInt(-year)} BCE` : `${parseInt(year)} CE`,
    mi
  };
}

const getCellAge = (index) => {
  let k = index % 20;
  let age;
  if (k >= 0 && k < 4) age = "GD";
  else if (k >= 4 && k < 7) age = "SD";
  else if (k >= 7 && k < 9) age = "BD";
  else if (k >= 9 && k < 10) age = "ID";
  else if (k >= 10 && k < 11) age = "IU";
  else if (k >= 11 && k < 13) age = "BU";
  else if (k >= 13 && k < 16) age = "SU";
  else if (k >= 16 && k < 20) age = "GU";
  return age;
}


const getCellAgeFromAngle = (k) => {
  let age;
  if (k >= 0 && k < 72) age = "GD";
  else if (k >= 72 && k < 126) age = "SD";
  else if (k >= 126 && k < 162) age = "BD";
  else if (k >= 162 && k < 180) age = "ID";
  else if (k >= 180 && k < 198) age = "IU";
  else if (k >= 198 && k < 234) age = "BU";
  else if (k >= 234 && k < 288) age = "SU";
  else if (k >= 288 && k < 360) age = "GU";
  return age;
}
  

export { MONTH_MAP, YUGA_NAME_MAP, JOURNEY_MAP, YUGA_TAG, GOLDEN_COLOR, SILVER_COLOR, BRONZE_COLOR, IRON_COLOR, GOLDEN_COLOR_SOLID, SILVER_COLOR_SOLID, BRONZE_COLOR_SOLID, IRON_COLOR_SOLID, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, INC, ANCHOR, ANCHOR_CELL, TURNS, SEGMENTS, CENTER_X, CENTER_Y, SVG_BOX, RADIUS, R1, R2, YUGA_SCALE, YUGA_SCALE_COLOR, GOLDEN_ANCHOR, IRON_ANCHOR, SEG_DEG, SEG_RAD, getYugaSvgData, getTag, formatToString, getDate, getCellAge, getCellAgeFromAngle, jsToYugaDeg, yugaToJsDeg, jsToYugaRad, yugaToJsRad, radToDeg, degToRad, yugaINDeg, yugaINRad };