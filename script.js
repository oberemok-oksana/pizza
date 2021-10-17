class Point {
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

class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }

  containsPoint(point) {
    return this.center.distanceTo(point) < this.radius;
  }
}

let dragTarget = null;
let pizza;
let totalCost = 20;

function setDragTargetPos(point) {
  let rect = dragTarget.getBoundingClientRect();
  point.move(-rect.width / 2, -rect.height / 2);
  dragTarget.style.left = point.x + "px";
  dragTarget.style.top = point.y + "px";
}

function distanceBetweenPoints(x1, y1, x2, y2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function getPizzaCircle() {
  let rect = pizza.getBoundingClientRect();
  let cx = rect.left + rect.width / 2;
  let cy = rect.top + rect.height / 2;
  let center = new Point(cx, cy);

  return new Circle(center, rect.width / 2);
}

function getPosOnPizza(mousePos) {
  let rect = pizza.getBoundingClientRect();

  return new Point(mousePos.x - rect.left, mousePos.y - rect.top);
}

document.addEventListener("DOMContentLoaded", () => {
  pizza = document.querySelector(".circle");
  let total = document.querySelector("#total-cost");

  window.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (!dragTarget) {
      if (e.target.matches(".panel-products .icons")) {
        let mousePoint = new Point(e.clientX, e.clientY);
        dragTarget = e.target.cloneNode(true);
        dragTarget.style.position = "fixed";
        document.body.append(dragTarget);
        setDragTargetPos(mousePoint);
      }
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (dragTarget) {
      setDragTargetPos(new Point(e.clientX, e.clientY));
    }
  });

  window.addEventListener("mouseup", (e) => {
    e.preventDefault();
    if (dragTarget) {
      let pizzaCircle = getPizzaCircle();
      let mousePos = new Point(e.clientX, e.clientY);

      if (pizzaCircle.containsPoint(mousePos)) {
        let newPos = getPosOnPizza(mousePos);
        setDragTargetPos(newPos);
        pizza.append(dragTarget);
        dragTarget.style.position = "absolute";
        totalCost += parseFloat(dragTarget.dataset.price);
        dragTarget = null;
        total.innerHTML = totalCost;
      } else {
        dragTarget.remove();
        dragTarget = null;
      }
    }
  });

  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (e.target.matches(".circle .icons")) {
      totalCost -= e.target.dataset.price;
      total.innerHTML = totalCost;
      e.target.remove();
    }
  });

  window.addEventListener("change", (e) => {
    if (e.target.matches(".sauce")) {
      if (e.target.checked) {
        totalCost += parseFloat(e.target.dataset.price);
      } else {
        totalCost -= parseFloat(e.target.dataset.price);
      }
      total.innerHTML = totalCost;
    }
  });
});
