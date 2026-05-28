function safe(v) {

  if (
    v === undefined ||
    v === null ||
    v === ""
  ) {
    return "0";
  }

  return v;
}

/* =========================
   FORMAT NUMBER
========================= */

function formatNumber(num){

  const n = Number(num);

  if(isNaN(n)) return "0";

  return n.toLocaleString(
    "en-US"
  );

}

/* =========================
   SEARCH PRODUCT
========================= */

async function searchProduct() {

  const keyword =
  document.getElementById(
    "searchInput"
  ).value.trim();

  if (!keyword) {

    alert("Nhập tên sản phẩm");

    return;
  }

  console.log(
    "SEARCH CLICK:",
    keyword
  );

  try {

    const res =
    await fetch(
      `/search?name=${encodeURIComponent(keyword)}`
    );

    const data =
    await res.json();

    console.log(
      "SEARCH RESULT:",
      data
    );

    const resultDiv =
    document.getElementById(
      "result"
    );

    resultDiv.innerHTML = "";

    if (!data || data.length === 0) {

      resultDiv.innerHTML = `
      <div class="card-result">
        <h2>Không tìm thấy sản phẩm</h2>
      </div>
      `;

      return;
    }

    data.forEach(item => {

      resultDiv.innerHTML += `
      <div class="card-result fade-in">

        <h2>${safe(item.product)}</h2>

        <div class="result-row">
          <div class="result-label">Giá bán (VND)</div>
          <div class="result-value">${formatNumber(item.sellPriceVND)}</div>
        </div>

        <div class="result-row">
          <div class="result-label">Giá bán (USD)</div>
          <div class="result-value">$ ${formatNumber(item.sellPriceUSD)}</div>
        </div>

        <div class="result-row">
          <div class="result-label">Taiwan Dollar</div>
          <div class="result-value">${formatNumber(item.sellPriceTWD)}</div>
        </div>

        <div class="result-row">
          <div class="result-label">Giá vốn / Unit</div>
          <div class="result-value">${formatNumber(item.avgCost)}</div>
        </div>

        <div class="result-row">
          <div class="result-label">Lợi nhuận gộp</div>
          <div class="result-value">${formatNumber(item.avgGrossProfit)}</div>
        </div>

        <div class="result-row">
          <div class="result-label">Tỷ lệ lợi nhuận</div>
          <div class="result-value">${safe(item.avgGrossRate)}</div>
        </div>

      </div>
      `;
    });

  } catch (err) {

    console.error("SEARCH ERROR:", err);

    alert("Search lỗi server");
  }
}

/* =========================
   AUTOCOMPLETE (SUGGEST)
========================= */

async function getSuggest() {

  const keyword =
  document.getElementById("searchInput").value.trim();

  const box =
  document.getElementById("suggestBox");

  if (!keyword) {
    box.innerHTML = "";
    return;
  }

  try {

    const res =
    await fetch(`/suggest?q=${encodeURIComponent(keyword)}`);

    const data =
    await res.json();

    if (!data || data.length === 0) {
      box.innerHTML = "";
      return;
    }

    box.innerHTML =
    data.map(item => `
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
