function save() {
  let height = document.getElementById("height").value;
  let weight = document.getElementById("weight").value;

  document.getElementById("result").textContent =
    "Height: " + height + " cm | Weight: " + weight + " kg";
}