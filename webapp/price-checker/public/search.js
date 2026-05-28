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
      card.className = "card-result";

      card.innerHTML = `
        <h2>📦 ${item.product}</h2>
        <p>💰 Sell Price (VND): ${item.sellPriceVND}</p>
        <p>📊 Profit Rate: ${item.avgGrossRate}</p>
      `;

      resultDiv.appendChild(card);
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

  if (!keyword.trim()) {
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

function selectSuggest(name) {
  document.getElementById("searchInput").value = name;
  document.getElementById("suggestBox").innerHTML = "";
  searchProduct();
}
