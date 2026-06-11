async function searchCustomer() {

  const keyword =
    document
      .getElementById("keyword")
      .value
      .trim();

  if (!keyword) {
    alert("Enter customer name");
    return;
  }

  const resultDiv =
    document.getElementById("result");

  resultDiv.innerHTML =
    "Loading...";

  try {

    const res =
      await fetch(
        `/customer-search?keyword=${encodeURIComponent(keyword)}`
      );

    const data =
      await res.json();

    if (!data.length) {

      resultDiv.innerHTML = `
        <div class="card">
          No customer found
        </div>
      `;

      return;
    }

    resultDiv.innerHTML =
      data.map(c => {

        const code =
          c["Customer ID / Code"] || "";

        const name =
          c["Customer Short Name"] || "";

        const address =
          c["Address"] ||
          c["Customer Address"] ||
          c["Address 1"] ||
          "";

        return `
          <div class="card">

            <h3>${name}</h3>

            <p>
              <b>Code:</b>
              ${code}
            </p>

            <p>
              <b>Address:</b>
              ${address}
            </p>

            <a
              class="map-btn"
              href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address + ' Vietnam')}"
              target="_blank"
            >
              📍 Open Map
            </a>

          </div>
        `;

      }).join("");

  } catch (err) {

    console.log(err);

    resultDiv.innerHTML = `
      <div class="card">
        Search Error
      </div>
    `;
  }
}

/* =========================
   CUSTOMER SUGGESTION
========================= */

const keywordInput =
  document.getElementById("keyword");

keywordInput.addEventListener("input", async () => {

  const q =
    keywordInput.value.trim();

  const suggestionDiv =
    document.getElementById("suggestions");

  if (!q) {

    if (suggestionDiv) {
      suggestionDiv.innerHTML = "";
    }

    return;
  }

  try {

    const res =
      await fetch(
        `/customer-suggest?q=${encodeURIComponent(q)}`
      );

    const data =
      await res.json();

    if (!suggestionDiv) return;

    suggestionDiv.innerHTML =
      data.map(name => `
        <div
          class="suggest-item"
          onclick="
            document.getElementById('keyword').value='${name}';
            document.getElementById('suggestions').innerHTML='';
          "
        >
          ${name}
        </div>
      `).join("");

  } catch (err) {

    console.log(err);

  }

});
