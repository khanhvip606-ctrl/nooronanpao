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
   SEARCH PRODUCT (FIXED)
========================= */

async function searchProduct() {

  const keyword =
    document.getElementById("searchInput").value.trim();

  if (!keyword || keyword.length < 2) {

    alert("Nhập ít nhất 2 ký tự");

    return;
  }

  console.log("SEARCH CLICK:", keyword);

  const resultDiv =
    document.getElementById("result");

  resultDiv.innerHTML = `
    <div class="card-result">
      <h2>⏳ Đang tìm kiếm...</h2>
    </div>
  `;

  try {

    const res =
      await fetch(`/search?name=${encodeURIComponent(keyword)}`);

    const data =
      await res.json();

    console.log("SEARCH RESULT:", data);

    resultDiv.innerHTML = "";

    if (!data || data.length === 0) {

      resultDiv.innerHTML = `
        <div class="card-result fade-in">
          <h2>❌ Không tìm thấy sản phẩm</h2>
        </div>
      `;

      return;
    }

    const html = data.map(item => {

      return `
        <div class="card-result fade-in">

          <h2>${safe(item.product)}</h2>

          <div class="result-row">
            <div class="result-label">Giá bán (VND)</div>
            <div class="result-value">
              ${formatNumber(item.sellPriceVND)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Giá bán (USD)</div>
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
            <div class="result-label">Giá vốn / Unit</div>
            <div class="result-value">
              ${formatNumber(item.avgCost)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Lợi nhuận gộp</div>
            <div class="result-value">
              ${formatNumber(item.avgGrossProfit)}
            </div>
          </div>

          <div class="result-row">
            <div class="result-label">Tỷ lệ lợi nhuận gộp</div>
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
        <h2>❌ Lỗi server khi tìm kiếm</h2>
      </div>
    `;

  }
}

/* =========================
   UPLOAD EXCEL
========================= */

async function uploadExcel() {

  const fileInput =
    document.getElementById("excelFile");

  const msg =
    document.getElementById("uploadStatus");

  const file =
    fileInput.files[0];

  if (!file) {

    msg.style.display = "block";
    msg.className = "error";
    msg.innerText = "❌ Chưa chọn file Excel";

    return;
  }

  const formData =
    new FormData();

  formData.append("excel", file);

  try {

    msg.style.display = "block";
    msg.className = "";
    msg.innerText = "⏳ Đang upload file...";

    const res =
      await fetch("/upload", {
        method: "POST",
        body: formData,
      });

    const data =
      await res.json();

    msg.className = "success";

    msg.innerText =
      "✅ Upload thành công " + data.total + " dòng dữ liệu";

  } catch (err) {

    msg.className = "error";
    msg.innerText = "❌ Upload thất bại";

  }
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
    msg.innerText = "✅ Login successful";

    setTimeout(() => {
      window.location.href = "/";
    }, 800);

  } else {

    msg.style.color = "#ef4444";
    msg.innerText = "❌ Wrong username or password";

  }

}

/* =========================
   CHECK LOGIN
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
