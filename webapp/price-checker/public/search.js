async function searchProduct() {
  const keyword = document.getElementById("searchInput").value.trim();

  if (!keyword) {
    alert("Nhập tên sản phẩm");
    return;
  }

  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = `
    <div class="card-result fade-in">
      <h2>⏳ Đang tìm kiếm...</h2>
    </div>
  `;

  try {
    const res = await fetch(`/search?name=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    resultDiv.innerHTML = "";

    if (!data || data.length === 0) {
      resultDiv.innerHTML = `
        <div class="card-result">
          <h2>❌ Không tìm thấy sản phẩm</h2>
        </div>
      `;
      return;
    }

    let html = "";

    data.forEach(item => {
      html += `
        <div class="card-result fade-in">

          <h2>📦 ${item.product}</h2>

          <div class="result-row">
            <div class="result-label">Giá bán</div>
            <div class="result-value">${item.sellPriceVND}</div>
          </div>

          <div class="result-row">
            <div class="result-label">Lợi nhuận</div>
            <div class="result-value">${item.avgGrossRate}</div>
          </div>

          <button class="login-btn" style="margin-top:15px"
            onclick='openDetail(${JSON.stringify(item)})'>
            Xem chi tiết
          </button>

        </div>
      `;
    });

    resultDiv.innerHTML = html;

  } catch (err) {
    console.error(err);
    alert("Search error server");
  }
}
