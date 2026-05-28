function safe(v) {
  if (v === undefined || v === null || v === "") return "0";
  return v;
}

function formatNumber(num) {
  const n = Number(num);
  if (isNaN(n)) return "0";
  return n.toLocaleString("en-US");
}

/* =========================
   SEARCH PRODUCT
========================= */

async function searchProduct() {

  const keyword = document.getElementById("searchInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!keyword) {
    alert("Enter product name");
    return;
  }

  try {

    const res = await fetch(`/search?name=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    resultDiv.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      resultDiv.innerHTML = `<div class="card-result"><h3>No products found</h3></div>`;
      return;
    }

    data.forEach((item, index) => {

      const detailId = "detail-" + index;

      const card = document.createElement("div");
      card.className = "card-result fade-in";

      card.innerHTML = `
        <div class="card-header">
          <h2>📦 ${safe(item.product)}</h2>

          <button class="detail-btn" id="btn-${detailId}" type="button">
            ⓘ
          </button>
        </div>

        <div class="card-body">

          <div class="row">
            <span class="label">💰 Selling Price</span>
            <span class="value">${formatNumber(item.sellPriceVND)} VND</span>
          </div>

          <div class="row highlight">
            <span class="label">📊 Profit Rate</span>
            <span class="value">${safe(item.avgGrossRate)}</span>
          </div>

        </div>

        <div id="${detailId}" class="detail-box" style="display:none;">

          <hr/>

          <div class="row">
            <span class="label">USD</span>
            <span class="value">$${formatNumber(item.sellPriceUSD)}</span>
          </div>

          <div class="row">
            <span class="label">TWD</span>
            <span class="value">${formatNumber(item.sellPriceTWD)}</span>
          </div>

          <div class="row">
            <span class="label">Cost</span>
            <span class="value">${formatNumber(item.costVND)}</span>
          </div>

          <div class="row">
            <span class="label">Profit</span>
            <span class="value">${formatNumber(item.profitVND)}</span>
          </div>

          <div class="row">
            <span class="label">Quantity</span>
            <span class="value">${safe(item.quantity)} Kg</span>
          </div>

        </div>
      `;

      resultDiv.appendChild(card);

      // ✅ ONLY ICON CLICK
      setTimeout(() => {

        const btn = document.getElementById(`btn-${detailId}`);
        const detail = document.getElementById(detailId);

        if (!btn || !detail) return;

        btn.addEventListener("click", (e) => {
          e.stopPropagation(); // không lan click

          const isOpen = detail.style.display === "block";
          detail.style.display = isOpen ? "none" : "block";
        });

      }, 0);

    });

  } catch (err) {
    console.error(err);
    alert("Search error");
  }
}


/* =========================
   AUTOCOMPLETE
========================= */

async function getSuggest() {

  const keyword = document.getElementById("searchInput").value;
  const box = document.getElementById("suggestBox");

  if (!keyword || keyword.trim() === "") {
    box.innerHTML = "";
    return;
  }

  try {

    const res = await fetch(`/suggest?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      box.innerHTML = "";
      return;
    }

    box.innerHTML = data.map(item => `
      <div class="suggest-item" onclick="selectSuggest('${item}')">
        🔎 ${item}
      </div>
    `).join("");

  } catch (err) {
    console.log(err);
  }
}

function selectSuggest(name) {
  document.getElementById("searchInput").value = name;
  document.getElementById("suggestBox").innerHTML = "";
  searchProduct();
}
