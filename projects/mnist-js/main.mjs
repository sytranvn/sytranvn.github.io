import * as tf from "https://cdnjs.cloudflare.com/ajax/libs/tensorflow/3.18.0/tf.fesm.js";
window.tf = tf;
const MODEL_DB = "tfmnist";
const MODEL_DB_URI = `indexeddb://${MODEL_DB}`;

let model;
try {
  model = await tf.loadLayersModel(MODEL_DB_URI);
  console.debug("Loaded model locally");
} catch (err) {
  console.error("Didn't find local model.", err);
  console.debug("Loading from remote");

  model = await tf.loadLayersModel("/tfmnist_json/model.json");
  console.debug("Loaded remote model and saving to local db.");
  model.save(MODEL_DB_URI);
}

document.querySelector("#predict").removeAttribute("disabled");

// setup canvas styles
const main = document.querySelector("main");
const maxwidth = Math.min(main.clientWidth / 2, 400);

const isDarkTheme = localStorage.getItem("colorscheme") === "dark";
const background = "black";
const ink = "white";

const canvas = document.querySelector("#canvas");
canvas.setAttribute("height", maxwidth);
canvas.setAttribute("width", maxwidth);
canvas.style.background = background;
const context = canvas.getContext("2d");

let isDown = false;
let prev = {};
let urlData;

function draw({ prev, pos, isDown = false, width = 10 }) {
  if (isDown) {
    context.beginPath();
    context.strokeStyle = ink;
    context.lineWidth = width;
    context.lineJoin = "round";
    context.moveTo(prev.x, prev.y);
    context.lineTo(pos.x, pos.y);
    context.closePath();
    context.stroke();
  }
}

function stopDraw() {
  isDown = false;
}

function mouseDown(e) {
  isDown = true;
  const { top, left } = canvas.getBoundingClientRect();
  prev = {
    x: e.clientX - left,
    y: e.clientY - top,
  };
}
function mouseMove(e) {
  if (isDown) {
    const { top, left } = canvas.getBoundingClientRect();
    const pos = {
      x: e.clientX - left,
      y: e.clientY - top,
    };
    draw({ prev, pos, isDown });
    prev = pos;
  }
}

function createTable(data) {
  const table = document.createElement("table");
  const tableBody = document.createElement("tbody");
  const tableHead = document.createElement("thead");
  const row = document.createElement("tr");
  const hrow = document.createElement("tr");
  data
    .filter((item) => item[1] > 0.5)
    .forEach(function (rowData) {
      const hcell = document.createElement("th");
      hcell.textContent = rowData[0];
      hrow.appendChild(hcell);

      const formatedData = rowData[1].toLocaleString(undefined, {
        style: "percent",
        maximumFractionDigits: 2,
      });
      const cell = document.createElement("td");
      cell.textContent = formatedData;
      row.appendChild(cell);
    });
  tableHead.appendChild(hrow);
  table.appendChild(tableHead);
  tableBody.appendChild(row);
  table.appendChild(tableBody);
  return table;
}

async function predict() {
  const image = tf.browser
    .fromPixels(context.getImageData(0, 0, canvas.height, canvas.width), 1)
    .resizeBilinear([28, 28])
    .div(255);
  const input = image.reshape([-1, 28 * 28]);
  const predictions = Object.entries(await model.predict([input]).data()).sort(
    (a, b) => b[1] - a[1]
  );
  document.querySelector("#result").replaceChildren(createTable(predictions));
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

document.querySelector("#clear").addEventListener("click", clearCanvas);
document.querySelector("#predict").addEventListener("click", predict);

canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);
