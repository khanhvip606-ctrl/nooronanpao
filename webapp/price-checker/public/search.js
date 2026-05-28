/* =========================
   SEARCH PRODUCT (FIXED)
========================= */

async function searchProduct() {
  const input = document.getElementById("searchInput");
  const keyword = input.value.trim();

  const resultDiv = document.getElementById("result");

  if (!keyword) {
    resultDiv.innerHTML = `
      <div class="card-result">
        <h2>⚠️ Vui lòng nhập tên sản phẩm</h2>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(`/search?name=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    resultDiv.innerHTML = "";

    if (!data || data.length === 0) {
      resultDiv.innerHTML = `
        <div class="card-result fade-in">
          <h2>❌ Không tìm thấy sản phẩm</h2>
        </div>
      `;
      return;
    }

    data.forEach(item => {

      const card = document.createElement("div");
      card.className = "card-result fade-in";

      card.innerHTML = `
        <h2>📦 ${item.product || "Unknown"}</h2>

        <div class="result-row">
          <div class="result-label">💰 Giá bán (VND)</div>
          <div class="result-value">${item.sellPriceVND || 0}</div>
        </div>

        <div class="result-row">
          <div class="result-label">📊 Profit Rate</div>
          <div class="result-value">${item.avgGrossRate || "0%"}</div>
        </div>

        <div class="result-row">
          <div class="result-label">👉 Click để xem chi tiết</div>
          <div class="result-value">OPEN</div>
        </div>
      `;

      card.onclick = () => {

        const modal = document.getElementById("modal");
        const modalBody = document.getElementById("modalBody");

        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
          <h2>📦 ${item.product}</h2>
          <hr>

          <h3>💰 SELLING PRICE</h3>
          <p>
            VND: ${item.sellPriceVND} ₫ <br>
            USD: $${item.sellPriceUSD} <br>
            TWD: ¥${item.sellPriceTWD}
          </p>

          <h3>🧾 COST PRICE</h3>
          <p>
            VND: ${item.costVND} ₫ <br>
            USD: $${item.costUSD} <br>
            TWD: ¥${item.costTWD}
          </p>

          <h3>📈 PROFIT</h3>
          <p>
            VND: ${item.profitVND} ₫ <br>
            USD: $${item.profitUSD} <br>
            TWD: ¥${item.profitTWD}
          </p>

          <hr>

          <p>⚖️ Quantity: ${item.quantity} Kg</p>
          <p>📊 Profit Rate: ${item.avgGrossRate}</p>
        `;

        modal.style.display = "block";
      };

      resultDiv.appendChild(card);
    });

  } catch (err) {
    console.error("SEARCH ERROR:", err);

    resultDiv.innerHTML = `
      <div class="card-result">
        <h2>❌ Server error khi tìm kiếm</h2>
      </div>
    `;
  }
}


/* =========================
   AUTOCOMPLETE / SUGGEST (FIXED)
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
    console.log("SUGGEST ERROR:", err);
  }
}


/* =========================
   SELECT SUGGEST
========================= */

function selectSuggest(name) {
  const input = document.getElementById("searchInput");
  const box = document.getElementById("suggestBox");

  input.value = name;
  box.innerHTML = "";

  searchProduct();
}


/* =========================
   MODAL CLOSE HANDLER (FIXED)
========================= */

document.addEventListener("click", (e) => {
  const modal = document.getElementById("modal");

  if (!modal) return;

  // click outside modal
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("closeModal");
  const modal = document.getElementById("modal");

  if (closeBtn && modal) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };
  }
});
