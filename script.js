class Pointt {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distanceTo(point) {
    let dx = point.x - this.x;
    let dy = point.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }
}

let dragTarget = null;
let pizza;

function setDragTargetPos(point) {
  let rect = dragTarget.getBoundingClientRect();
  point.move(rect.width / 2, rect.height / 2);
  dragTarget.style.left = point.x + "px";
  dragTarget.style.top = point.y + "px";
}

function distanceBetweenPoints(x1, y1, x2, y2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function getPizzaCenter() {
  let rect = pizza.getBoundingClientRect();
  let cx = rect.left + rect.width / 2;
  let cy = rect.top + rect.height / 2;
  return { x: cx, y: cy };
}
function getPosOnPizza(mousePos) {
  let rect = pizza.getBoundingClientRect();
  // return new
}

document.addEventListener("DOMContentLoaded", () => {
  pizza = document.querySelector(".circle");
  window.addEventListener("mousedown", (e) => {
    let mousePoint = new Point(e.clientX, e.clientY);
    if (e.target.matches(".product")) {
      dragTarget = e.target.cloneNode(true);
      dragTarget.style.position = "fixed";

      document.body.append(dragTarget);
      setDragTargetPos(mousePoint);
    }

    if (e.target.matches(".circle")) {
      circleRect(e.clientX, e.clientY);
      console.log(e.clientX, e.clientY);
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (dragTarget) {
      setDragTargetPos(new Point(e.clientX, e.clientY));
    }
  });
  window.addEventListener("mouseup", (e) => {
    if (dragTarget) {
      dragTarget.remove();
      dragTarget = null;
    }
  });
});
