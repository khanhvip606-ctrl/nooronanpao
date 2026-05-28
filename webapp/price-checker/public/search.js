async function searchProduct() {
  const keyword = document.getElementById("searchInput").value;

  try {

    // ❗ FIX RENDER: bỏ localhost
    const res = await fetch(`/search?name=${encodeURIComponent(keyword)}`);

    const data = await res.json();

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!data || data.length === 0) {
      resultDiv.innerHTML = "<h3>Không tìm thấy sản phẩm</h3>";
      return;
    }

    data.forEach(item => {

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h2>📦 ${item.product}</h2>
        <p>💰 VND: ${item.sellPriceVND}</p>
        <p>📊 Rate: ${item.avgGrossRate}</p>
        <small>👉 Click để xem chi tiết</small>
      `;

      card.onclick = () => {
        document.getElementById("modalBody").innerHTML = `
          <h2>📦 ${item.product}</h2>
          <hr>

          <h3>💰 GIÁ BÁN</h3>
          <p>
            VND: ${item.sellPriceVND} ₫ <br>
            USD: $${item.sellPriceUSD} <br>
            TWD: ¥${item.sellPriceTWD}
          </p>

          <h3>🧾 GIÁ VỐN</h3>
          <p>
            VND: ${item.costVND} ₫ <br>
            USD: $${item.costUSD} <br>
            TWD: ¥${item.costTWD}
          </p>

          <h3>📈 LỢI NHUẬN</h3>
          <p>
            VND: ${item.profitVND} ₫ <br>
            USD: $${item.profitUSD} <br>
            TWD: ¥${item.profitTWD}
          </p>

          <hr>

          <p>⚖️ Quantity: ${item.quantity} Kg</p>
          <p>📊 Rate: ${item.avgGrossRate}</p>
        `;

        document.getElementById("modal").style.display = "block";
      };

      resultDiv.appendChild(card);
    });

    document.getElementById("closeModal").onclick = () => {
      document.getElementById("modal").style.display = "none";
    };

    window.onclick = (e) => {
      if (e.target.id === "modal") {
        document.getElementById("modal").style.display = "none";
      }
    };

  } catch (err) {
    console.error(err);
    alert("Search lỗi server");
  }
}


/* =====================================================
   ⭐ AUTOCOMPLETE / SUGGEST FEATURE
===================================================== */

async function getSuggest() {

  const keyword =
  document.getElementById("searchInput").value;

  const box =
  document.getElementById("suggestBox");

  if (!keyword || keyword.trim() === "") {
    box.innerHTML = "";
    return;
  }

  try {

    // ❗ FIX RENDER: bỏ localhost
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

function selectSuggest(name) {

  document.getElementById("searchInput").value = name;

  document.getElementById("suggestBox").innerHTML = "";

  searchProduct();

}
