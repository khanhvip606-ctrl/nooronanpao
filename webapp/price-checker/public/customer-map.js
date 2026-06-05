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

                <button
        class="map-btn"
        onclick="openMap('${address.replace(/'/g, "\\'")}')"
      >
        📍 Open Map
      </button>

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
    async function openMap(address) {

  try {

    const res = await fetch(
      `/geocode?address=${encodeURIComponent(address)}`
    );

    const data = await res.json();

    if (!data) {
      alert("Cannot find location");
      return;
    }

    const url =
      `https://www.google.com/maps?q=${data.lat},${data.lng}`;

    window.open(url, "_blank");

  } catch (err) {
    console.log(err);
    alert("Map error");
  }
}
  }
}
