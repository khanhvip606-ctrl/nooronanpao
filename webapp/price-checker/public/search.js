let profitChart = null;
let currentChartType = "bar";

window.currentData = [];

/* =========================
   SAFE
========================= */

function safe(v){
  if(v === undefined || v === null || v === ""){
    return "0";
  }
  return v;
}

function formatNumber(num){

  const n = Number(num);

  if(isNaN(n)) return "0";

  return n.toLocaleString("en-US");
}

/* =========================
   SEARCH PRODUCT
========================= */

async function searchProduct(){

  const keyword =
    document.getElementById("searchInput").value.trim();

  const resultDiv =
    document.getElementById("result");

  if(!keyword){
    alert("Enter product name");
    return;
  }

  try{

    const res =
      await fetch(`/search?name=${encodeURIComponent(keyword)}`);

    const data =
      await res.json();

    window.currentData = data;

    resultDiv.innerHTML = "";

    if(!Array.isArray(data) || data.length === 0){

      resultDiv.innerHTML = `
        <div class="card-result">
          <h3>No products found</h3>
        </div>
      `;

      return;
    }

    data.forEach((item,index)=>{

      const detailId =
        "detail-" + index;

      const card =
        document.createElement("div");

      card.className =
        "card-result fade-in";

      card.innerHTML = `

        <div class="card-header">
          <h2>📦 ${safe(item.product)}</h2>
        </div>

        <div class="card-body">

          <div class="row">
            <span class="label">
              💰 Selling Price
            </span>

            <span class="value">
              ${formatNumber(item.sellPriceVND)} VND
            </span>
          </div>

          <div class="row highlight">
            <span class="label">
              📊 Profit Rate
            </span>

            <span class="value">
              ${safe(item.avgGrossRate)}
            </span>
          </div>

          <div class="icon-row">
            <button
              class="detail-btn"
              id="btn-${detailId}"
            >
              ⓘ Click
            </button>
          </div>

        </div>

        <div
          id="${detailId}"
          class="detail-box"
          style="display:none;"
        >

          <hr/>

          <div class="row">
            <span class="label">USD</span>

            <span class="value">
              $${formatNumber(item.sellPriceUSD)}
            </span>
          </div>

          <div class="row">
            <span class="label">TWD</span>

            <span class="value">
              ${formatNumber(item.sellPriceTWD)}
            </span>
          </div>

          <div class="row">
            <span class="label">Cost</span>

            <span class="value">
              ${formatNumber(item.costVND)}
            </span>
          </div>

          <div class="row">
            <span class="label">Profit</span>

            <span class="value">
              ${formatNumber(item.profitVND)}
            </span>
          </div>

          <div class="row">
            <span class="label">Quantity</span>

            <span class="value">
              ${safe(item.quantity)} Kg
            </span>
          </div>

        </div>
      `;

      resultDiv.appendChild(card);

      const btn =
        card.querySelector(`#btn-${detailId}`);

      const detail =
        card.querySelector(`#${detailId}`);

      btn.addEventListener("click",()=>{

        detail.style.display =
          detail.style.display === "block"
          ? "none"
          : "block";

      });

    });

    /* 🔥 AUTO RENDER CHART */
    renderChart();

  }

  catch(err){

    console.log(err);

    alert("Search error");
  }

}

/* =========================
   TOGGLE CHART
========================= */

function toggleChart(){

  const chartBox =
    document.getElementById("chartContainer");

  if(
    chartBox.style.display === "none"
    ||
    chartBox.style.display === ""
  ){

    chartBox.style.display = "block";

    renderChart();

  }else{

    chartBox.style.display = "none";

  }

}

/* =========================
   CHANGE CHART TYPE
========================= */

function changeChartType(type){

  currentChartType = type;

  renderChart();

}

/* =========================
   RENDER CHART
========================= */

function renderChart(){

  const canvas =
    document.getElementById("profitChart");

  const labels =
    window.currentData.map(i => i.product);

  const profits =
    window.currentData.map(i =>
      Number(i.profitVND || 0)
    );

  if(profitChart){
    profitChart.destroy();
  }

  profitChart = new Chart(canvas, {

    type: currentChartType,

    data: {

      labels,

      datasets:[{

        label:"Profit (VND)",

        data:profits,

        backgroundColor:[
          "#38bdf8",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6"
        ],

        borderColor:"#38bdf8",

        borderWidth:2,

        tension:0.4,

        fill:true,

        borderRadius:10

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
          },
          grid:{
            display:false
          }
        },

        y:{
          ticks:{
            color:"white"
          },
          grid:{
            color:"rgba(255,255,255,0.05)"
          }
        }

      }

    }

  });

}

/* =========================
   AUTOCOMPLETE
========================= */

async function getSuggest(){

  const keyword =
    document.getElementById("searchInput").value.trim();

  const box =
    document.getElementById("suggestBox");

  if(!keyword){
    box.innerHTML = "";
    return;
  }

  try{

    const res =
      await fetch(`/suggest?q=${encodeURIComponent(keyword)}`);

    const data =
      await res.json();

    if(!Array.isArray(data) || data.length === 0){

      box.innerHTML = "";

      return;
    }

    box.innerHTML =
      data.map(item => `

        <div
          class="suggest-item"
          onclick="selectSuggest('${item}')"
        >
          🔎 ${item}
        </div>

      `).join("");

  }

  catch(err){

    console.log(err);

  }

}

function selectSuggest(name){

  document.getElementById("searchInput").value = name;

  document.getElementById("suggestBox").innerHTML = "";

  searchProduct();

}
