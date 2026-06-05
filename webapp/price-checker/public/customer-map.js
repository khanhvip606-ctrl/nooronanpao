async function searchCustomer() {

  const keyword =
    document
      .getElementById("keyword")
      .value
      .trim();

  if(!keyword){
    alert("Enter customer name");
    return;
  }

  const resultDiv =
    document.getElementById("result");

  resultDiv.innerHTML =
    "Loading...";

  try{

    const res =
      await fetch(
        `/customer-search?keyword=${encodeURIComponent(keyword)}`
      );

    const data =
      await res.json();

    if(!data.length){

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

        const mapUrl =
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

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
              href="${mapUrl}"
              target="_blank"
            >
              📍 Open Google Maps
            </a>

          </div>

        `;

      }).join("");

  }catch(err){

    console.log(err);

    resultDiv.innerHTML = `
      <div class="card">
        Search Error
      </div>
    `;
  }
}
