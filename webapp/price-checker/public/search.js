/* =========================
   UPLOAD EXCEL
========================= */

async function uploadExcel() {

  const fileInput = document.getElementById("excelFile");
  const msg = document.getElementById("uploadStatus");

  if (!fileInput || !msg) return;

  const file = fileInput.files[0];

  if (!file) {
    msg.style.display = "block";
    msg.className = "error";
    msg.innerText = "❌ Please select file";
    return;
  }

  const formData = new FormData();
  formData.append("excel", file);

  try {

    msg.style.display = "block";
    msg.className = "";
    msg.innerText = "Uploading...";

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    msg.className = "success";
    msg.innerText = "Upload success: " + (data.total || 0) + " rows";

  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.innerText = "Upload failed";
  }
}


/* =========================
   LOGIN
========================= */

function login() {

  const username = document.getElementById("username")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();
  const msg = document.getElementById("loginMsg");

  if (!msg) return;

  if (
    username === "nooronanpao" &&
    password === "nooronanpaonhontrach"
  ) {

    localStorage.setItem("loggedIn", "true");

    msg.style.color = "#22c55e";
    msg.innerText = "Login success";

    setTimeout(() => {
      window.location.href = "/";
    }, 800);

  } else {

    msg.style.color = "#ef4444";
    msg.innerText = "Wrong username or password";
  }
}


/* =========================
   CHECK LOGIN (SAFE)
========================= */

(function checkLogin() {

  const loggedIn = localStorage.getItem("loggedIn");
  const currentPage = window.location.pathname;

  if (loggedIn !== "true") {
    if (!currentPage.includes("login.html")) {
      window.location.href = "/login.html";
    }
  } else {
    if (currentPage.includes("login.html")) {
      window.location.href = "/";
    }
  }

})();


/* =========================
   LOGOUT
========================= */

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "/login.html";
}
