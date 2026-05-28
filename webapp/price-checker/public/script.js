
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

function formatNumber(num) {

  const n = Number(num);

  if (isNaN(n)) return "0";

  return n.toLocaleString("en-US");
}

/* =========================
   SEARCH PRODUCT
========================= */

async function searchProduct() {

  const keyword =
    document.getElementById("searchInput").value.trim();

  if (!keyword || keyword.length < 2) {
    alert("Please enter at least 2 characters");
    return;
  }

  console.log("SEARCH:", keyword);

  const resultDiv =
    document.getElementById("result");

  resultDiv.innerHTML = `
    <div class="card-result">
      <h2>Searching...</h2>
    </div>
  `;

  try {

    const res =
      await fetch(`/search?name=${encodeURIComponent(keyword)}`);

    const data =
      await res.json();

    resultDiv.innerHTML = "";

    if (!data || data.length === 0) {

      resultDiv.innerHTML = `
        <div class="card-result fade-in">
          <h2>No products found</h2>
        </div>
      `;

      return;
    }

    const html = data.map(item => {

      return `
        <div class="card-result fade-in">

          <h2>${safe(item.product)}</h2>

          <div class="result-row">
            <div class="result-label">Selling Price (VND)</div>
            <div class="result-value">
              ${formatNumber(item.sellPriceVND)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Selling Price (USD)</div>
            <div class="result-value">
              $ ${formatNumber(item.sellPriceUSD)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Taiwan Dollar</div>
            <div class="result-value">
              ${formatNumber(item.sellPriceTWD)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Cost per Unit</div>
            <div class="result-value">
              ${formatNumber(item.avgCost)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Gross Profit</div>
            <div class="result-value">
              ${formatNumber(item.avgGrossProfit)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Gross Profit Rate</div>
            <div class="result-value">
              ${safe(item.avgGrossRate)}
            </div>
          </div>

        </div>
      `;

    }).join("");

    resultDiv.innerHTML = html;

  } catch (err) {

    console.error("SEARCH ERROR:", err);

    document.getElementById("result").innerHTML = `
      <div class="card-result">
        <h2>Server Error</h2>
      </div>
    `;

  }
}

/* =========================
   AUTOCOMPLETE (RESTORED + FIXED)
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

  document.getElementById("searchInput").value = name;

  document.getElementById("suggestBox").innerHTML = "";

  searchProduct();
}

/* =========================
   LOGIN SYSTEM
========================= */

function login() {

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value.trim();

  const msg =
    document.getElementById("loginMsg");

  if (
    username === "nooronanpao" &&
    password === "nooronanpaonhontrach"
  ) {

    localStorage.setItem("loggedIn", "true");

    msg.style.color = "#22c55e";
    msg.innerText = "Login successful";

    setTimeout(() => {
      window.location.href = "/";
    }, 800);

  } else {

    msg.style.color = "#ef4444";
    msg.innerText = "Wrong username or password";

  }
}

/* =========================
   LOGIN CHECK
========================= */

const loggedIn =
  localStorage.getItem("loggedIn");

const currentPage =
  window.location.pathname;

if (loggedIn !== "true") {

  if (!currentPage.includes("login.html")) {
    window.location.href = "/login.html";
  }

} else {

  if (currentPage.includes("login.html")) {
    window.location.href = "/";
  }

}

/* =========================
   LOGOUT
========================= */

function logout() {

  localStorage.removeItem("loggedIn");

  window.location.href = "/login.html";

}
