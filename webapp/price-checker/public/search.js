function safe(v) {
  if (v === undefined || v === null || v === "") {
    return "0";
  }
  return v;
}

/* =========================
   FORMAT NUMBER
========================= */

function formatNumber(num) {
  const n = Number(num);
  if (isNaN(n)) return "0";
  return n.toLocaleString("en-US");
}

/* =========================
   SEARCH PRODUCT (RESTORED ORIGINAL STYLE)
========================= */

async function searchProduct() {

  const keyword = document.getElementById("searchInput").value.trim();

  if (!keyword) {
    alert("Enter product name");
    return;
  }

  try {

    const res = await fetch(`/search?name=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!data || data.length === 0) {
      resultDiv.innerHTML = "<h3>No products found</h3>";
      return;
    }

    data.forEach(item => {

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h2>📦 ${safe(item.product)}</h2>
        <p>💰 Selling Price: ${formatNumber(item.sellPriceVND)}</p>
        <p>📊 Profit Rate: ${safe(item.avgGrossRate)}</p>
        <small>👉 Click to view details</small>
      `;

      card.onclick = () => {

        document.getElementById("modalBody").innerHTML = `
          <h2>📦 ${safe(item.product)}</h2>
          <hr>

          <h3>💰 SELLING PRICE</h3>
          <p>
            VND: ${formatNumber(item.sellPriceVND)} ₫ <br>
            USD: $${formatNumber(item.sellPriceUSD)} <br>
            TWD: ¥${formatNumber(item.sellPriceTWD)}
          </p>

          <h3>🧾 COST PRICE</h3>
          <p>
            VND: ${formatNumber(item.costVND)} ₫ <br>
            USD: $${formatNumber(item.costUSD)} <br>
            TWD: ¥${formatNumber(item.costTWD)}
          </p>

          <h3>📈 PROFIT</h3>
          <p>
            VND: ${formatNumber(item.profitVND)} ₫ <br>
            USD: $${formatNumber(item.profitUSD)} <br>
            TWD: ¥${formatNumber(item.profitTWD)}
          </p>

          <hr>

          <p>⚖️ Quantity: ${safe(item.quantity)} Kg</p>
          <p>📊 Profit Rate: ${safe(item.avgGrossRate)}</p>
        `;

        document.getElementById("modal").style.display = "block";
      };

      resultDiv.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert("Search error from server");
  }
}


/* =========================
   ⭐ AUTOCOMPLETE (RESTORED)
========================= */

async function getSuggest() {

  const keyword = document.getElementById("searchInput").value.trim();
  const box = document.getElementById("suggestBox");

  if (!keyword) {
    box.innerHTML = "";
    return;
  }

  try {

    const res = await fetch(`/suggest?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (!data || data.length === 0) {
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


/* =========================
   SELECT SUGGEST
========================= */

function selectSuggest(name) {
  document.getElementById("searchInput").value = name;
  document.getElementById("suggestBox").innerHTML = "";
  searchProduct();
}
