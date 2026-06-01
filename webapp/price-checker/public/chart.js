function renderChart() {

  const canvas = document.getElementById("profitChart");

  const labels = window.currentData.map(i => i.product);
  const profits = window.currentData.map(i => Number(i.profitVND || 0));

  if (profitChart) {
    profitChart.destroy();
  }

  profitChart = new Chart(canvas, {
    type: "line", // 🔥 đổi ở đây

    data: {
      labels,
      datasets: [{
        label: "Profit (VND)",

        data: profits,

        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.2)",

        fill: true,           // 🔥 tô vùng dưới line
        tension: 0.4,         // 🔥 làm đường cong mềm

        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#38bdf8"
      }]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        },

        tooltip: {
          callbacks: {
            label: (ctx) =>
              ctx.raw.toLocaleString() + " VND"
          }
        }
      },

      scales: {
        x: {
          ticks: { color: "white" },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: "white",
            callback: v => v.toLocaleString()
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
      },

      animation: {
        duration: 1000,
        easing: "easeOutQuart"
      }
    }
  });
}
function renderCompareChart(){

  const labels =
    window.selectedProducts.map(
      p => p.product
    );

  const profits =
    window.selectedProducts.map(
      p => Number(p.profitVND || 0)
    );

  const ctx =
    document.getElementById("profitChart");

  if(profitChart){
    profitChart.destroy();
  }

  profitChart = new Chart(ctx,{

    type:"bar",

    data:{

      labels,

      datasets:[{

        label:"Profit (VND)",

        data:profits,

        backgroundColor:
          "rgba(56,189,248,0.5)",

        borderColor:"#38bdf8",

        borderWidth:2

      }]
    },

    options:{
      responsive:true
    }
  });
}
