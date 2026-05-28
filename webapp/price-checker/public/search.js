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
   SEARCH PRODUCT (RESTORED + FIXED)
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
      resultDiv.innerHTML = `
        <div class="card-result">
          <h2>No products found</h2>
        </div>
      `;
      return;
    }

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card-result fade-in";

      card.innerHTML = `
        <h2>📦 ${safe(item.product)}</h2>

        <div class="result-row">
          <div class="result-label">Selling Price (VND)</div>
          <div class="result-value">${formatNumber(item.sellPriceVND)}</div>
        </div>

        <div class="result-row">
          <div class="result-label">Profit Rate</div>
          <div class="result-value">${safe(item.avgGrossRate)}</div>
        </div>

        <div class="result-row">
          <div class="result-label">Click</div>
          <div class="result-value">View details</div>
        </div>
      `;

      card.onclick = () => {
        const modalBody = document.getElementById("modalBody");

        modalBody.innerHTML = `
          <h2>📦 ${safe(item.product)}</h2>
          <hr>

          <h3>SELLING PRICE</h3>
          <p>
            VND: ${formatNumber(item.sellPriceVND)} ₫ <br>
            USD: $${formatNumber(item.sellPriceUSD)} <br>
            TWD: ¥${formatNumber(item.sellPriceTWD)}
          </p>

          <h3>COST PRICE</h3>
          <p>
            VND: ${formatNumber(item.costVND)} ₫ <br>
            USD: $${formatNumber(item.costUSD)} <br>
            TWD: ¥${formatNumber(item.costTWD)}
          </p>

          <h3>PROFIT</h3>
          <p>
            VND: ${formatNumber(item.profitVND)} ₫ <br>
            USD: $${formatNumber(item.profitUSD)} <br>
            TWD: ¥${formatNumber(item.profitTWD)}
          </p>

          <hr>

          <p>Quantity: ${formatNumber(item.quantity)} Kg</p>
          <p>Profit Rate: ${safe(item.avgGrossRate)}</p>
        `;

        document.getElementById("modal").style.display = "block";
      };

      resultDiv.appendChild(card);
    });

    // modal close (safe init)
    const closeBtn = document.getElementById("closeModal");
    if (closeBtn) {
      closeBtn.onclick = () => {
        document.getElementById("modal").style.display = "none";
      };
    }

    window.onclick = (e) => {
      if (e.target.id === "modal") {
        document.getElementById("modal").style.display = "none";
      }
    };
  } catch (err) {
    console.error(err);
    alert("Search error");
  }
}

/* =========================
   AUTOCOMPLETE (FIXED)
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

    if (!data || data.length === 0) {
      box.innerHTML = "";
      return;
    }

    box.innerHTML = data
      .map(
        (item) =>
          `<div class="suggest-item" onclick="selectSuggest('${item}')">🔎 ${item}</div>`
      )
      .join("");
  } catch (err) {
    console.log("suggest error", err);
  }
}

function selectSuggest(name) {
  document.getElementById("searchInput").value = name;
  document.getElementById("suggestBox").innerHTML = "";
  searchProduct();
}
