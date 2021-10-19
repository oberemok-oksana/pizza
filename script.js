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

class Product {
  constructor(name, count, price) {
    this.name = name;
    this.count = count;
    this.price = price;
  }
}

let dragTarget = null;
let pizza;
const DOUGH_PRICE = 20;
let totalCost = DOUGH_PRICE;
let ingredients = [new Product("dough", 1, DOUGH_PRICE)];
let sauces = [];

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
  let modal = document.querySelector(".modal-window");
  let orderBtn = document.querySelector(".order_btn");
  let okBtn = document.querySelector(".ok_btn");
  let wrapper = document.querySelector(".wrapper");
  let total = document.querySelector("#total-cost");
  let table = document.querySelector(".bill");
  let tableBody = document.querySelector(".modal-window__body");
  let tbody = table.querySelector(".chosen_products");
  let ordered = false;
  let allSauces = document.querySelectorAll(".sauce");
  let tfoot = document.querySelector(".tfoot");

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
        let ingredient = ingredients.find(
          (item) => item.name === dragTarget.dataset.name
        );
        if (ingredient) {
          ingredient.count++;
        } else {
          ingredients.push(
            new Product(
              dragTarget.dataset.name,
              1,
              parseFloat(dragTarget.dataset.price)
            )
          );
        }

        console.log(ingredients);
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
      totalCost -= parseFloat(e.target.dataset.price);
      total.innerHTML = totalCost;
      e.target.remove();

      let index = ingredients.findIndex(
        (item) => item.name === e.target.dataset.name
      );

      if (ingredients[index].count === 1) {
        ingredients.splice(index, 1);
      } else {
        ingredients[index].count--;
      }
      console.log(ingredients);
    }
  });

  window.addEventListener("change", (e) => {
    if (e.target.matches(".sauce")) {
      if (e.target.checked) {
        totalCost += parseFloat(e.target.dataset.price);
        sauces.push(
          new Product(
            e.target.dataset.name,
            1,
            parseFloat(e.target.dataset.price)
          )
        );
      } else {
        totalCost -= parseFloat(e.target.dataset.price);
        let index = sauces.findIndex(
          (item) => item.name === e.target.dataset.name
        );
        sauces.splice(index, 1);
      }
      total.innerHTML = totalCost;
    }
  });

  orderBtn.addEventListener("click", () => {
    wrapper.style.display = "none";
    modal.style.display = "flex";
    table.style.display = "table";
    tbody.innerHTML = "";
    tfoot.innerHTML = "";
    let sum = 0;
    let trIngredients = document.createElement("tr");
    let tdIngredients = document.createElement("td");
    tdIngredients.setAttribute("colspan", 4);
    tdIngredients.innerHTML = "Ingredients";
    trIngredients.classList.add("ingredient");
    trIngredients.append(tdIngredients);

    tbody.append(trIngredients);

    ingredients.forEach((item) => {
      let tr = document.createElement("tr");
      let tdName = document.createElement("td");
      let tdCount = document.createElement("td");
      let tdPrice = document.createElement("td");
      let tdSumm = document.createElement("td");
      tdName.innerHTML = item.name;
      tdCount.innerHTML = item.count;
      tdPrice.innerHTML = item.price;
      let ingredientsSum = item.count * item.price;
      sum += ingredientsSum;
      tdSumm.innerHTML = ingredientsSum;

      tr.append(tdName, tdCount, tdPrice, tdSumm);
      tbody.append(tr);
    });

    if (sauces.length > 0) {
      let trSauces = document.createElement("tr");
      trSauces.classList.add("ingredient");
      let tdSauces = document.createElement("td");
      tdSauces.setAttribute("colspan", 4);
      tdSauces.innerHTML = "Sauces";
      trSauces.append(tdSauces);
      tbody.append(trSauces);
    }
    sauces.forEach((sauce) => {
      let tr = document.createElement("tr");
      let tdSauceName = document.createElement("td");
      tdSauceName.innerHTML = sauce.name;
      let tdSaucePrice = document.createElement("td");
      tdSaucePrice.innerHTML = sauce.price;
      let tdEmpty = document.createElement("td");
      tdEmpty.innerHTML = "";
      let tdEmptySecond = document.createElement("td");
      tdEmptySecond.innerHTML = "";

      sum += sauce.price;
      tr.append(tdSauceName, tdEmpty, tdEmptySecond, tdSaucePrice);
      tbody.append(tr);
    });

    let trTotal = document.createElement("tr");
    let tdTotal = document.createElement("td");
    let td = document.createElement("td");
    let tdAllCost = document.createElement("td");
    tdAllCost.innerHTML = "Total";
    td.setAttribute("colspan", 2);
    tdTotal.classList.add("bold");
    td.classList.add("bold");
    tdTotal.innerHTML = sum;
    trTotal.append(tdAllCost, td, tdTotal);
    tfoot.append(trTotal);
  });

  okBtn.addEventListener("click", () => {
    if (ordered) {
      wrapper.style.display = "flex";
      modal.style.display = "none";
      pizza.innerHTML = "";
      ordered = false;
      ingredients = [new Product("dough", 1, DOUGH_PRICE)];
      sauces = [];
      totalCost = DOUGH_PRICE;
      total.innerHTML = DOUGH_PRICE;
      let congratsText = document.querySelector(".ordered");
      congratsText.remove();
      allSauces.forEach((sauce) => (sauce.checked = false));
    } else {
      ordered = true;
      table.style.display = "none";
      let text = document.createElement("div");
      text.classList.add("ordered");
      text.innerHTML = "Congrats! Your order has been created successfully ";
      tableBody.append(text);
    }
  });
});
