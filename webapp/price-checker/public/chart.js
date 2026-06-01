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

  const wrapper =
    document.getElementById("chartWrapper");

  wrapper.style.display = "block";

  wrapper.scrollIntoView({
    behavior:"smooth",
    block:"end"
  });

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

    type: currentChartType,

    data:{

      labels,

      datasets:[{

        label:"Profit (VND)",

        data:profits,

        backgroundColor:[
          "rgba(56,189,248,0.6)",
          "rgba(34,197,94,0.6)",
          "rgba(249,115,22,0.6)",
          "rgba(168,85,247,0.6)",
          "rgba(239,68,68,0.6)"
        ],

        borderColor:"#38bdf8",

        borderWidth:2,

        fill:true,

        tension:0.4
      }]
    },

    options:{

      responsive:true,

      plugins:{
        legend:{
          labels:{
            color:"white"
          }
        }
      },

      scales:
      currentChartType === "pie"
      ? {}
      : {

        x:{
          ticks:{
            color:"white"
          }
        },

        y:{
          ticks:{
            color:"white"
          }
        }
      }
    }
  });
}
/* =========================
   COMPARE PRODUCT
========================= */

function addToCompare(index){

  const item = window.currentData[index];

  const exists =
    window.selectedProducts.find(
      p => p.product === item.product
    );

  if(exists){
    alert("Product already selected");
    return;
  }

  window.selectedProducts.push(item);

  alert(
    `${item.product} added to compare`
  );
}

/* =========================
   SHOW COMPARE TABLE
========================= */

function showCompare(){

  if(window.selectedProducts.length < 2){

    alert("Select at least 2 products");

    return;
  }

  let html = `

  <div class="card-result">

    <h2>⚖ Product Comparison</h2>

    <table
      style="
      width:100%;
      border-collapse:collapse;
      text-align:center;
      "
    >

      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Cost</th>
        <th>Profit</th>
        <th>Rate</th>
      </tr>

  `;

  window.selectedProducts.forEach(item=>{

    html += `

      <tr>

        <td>${item.product}</td>

        <td>
          ${formatNumber(item.sellPriceVND)}
        </td>

        <td>
          ${formatNumber(item.costVND)}
        </td>

        <td>
          ${formatNumber(item.profitVND)}
        </td>

        <td>
          ${item.avgGrossRate}
        </td>

      </tr>

    `;
  });

  html += `
    </table>
  </div>
  `;

  document.getElementById("result").innerHTML += html;

  renderCompareChart();
}
