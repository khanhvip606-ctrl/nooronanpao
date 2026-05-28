const ctx = document.getElementById("profitChart");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["A", "B", "C"],
    datasets: [{
      label: "Profit",
      data: [100, 200, 150],
      backgroundColor: "#38bdf8"
    }]
  }
});
