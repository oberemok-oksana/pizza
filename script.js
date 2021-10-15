let dragTarget = null;
let pizza;

function setDragTargetPos(x, y) {
  let rect = dragTarget.getBoundingClientRect();
  x = x - rect.width / 2;
  y = y - rect.height / 2;
  dragTarget.style.left = x + "px";
  dragTarget.style.top = y + "px";
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
    if (e.target.matches(".product")) {
      dragTarget = e.target.cloneNode(true);
      dragTarget.style.position = "fixed";

      document.body.append(dragTarget);
      setDragTargetPos(e.clientX, e.clientY);
    }

    if (e.target.matches(".circle")) {
      circleRect(e.clientX, e.clientY);
      console.log(e.clientX, e.clientY);
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (dragTarget) {
      setDragTargetPos(e.clientX, e.clientY);
    }
  });
  window.addEventListener("mouseup", (e) => {
    if (dragTarget) {
      let pizzaCenter = getPizzaCenter();
      let pizzaRadius = getPizzaRadius();
      // let mousePos = e.clientX,e.clientY;
      let d = pizzaCenter.distanceTo(mousePos);
      if (d < pizzaRadius) {
        let newPos = getPosOnPizza(mousePos);
        setDragTargetPos(newPos);
        pizza.append(dragTarget);
        dragTarget.style.position = "absolute";
        dragTarget = null;
      }
      dragTarget.remove();
      dragTarget = null;
    }
  });
});
