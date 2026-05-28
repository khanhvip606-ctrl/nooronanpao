async function uploadExcel() {

  const fileInput = document.getElementById("excelFile");
  const msg = document.getElementById("uploadStatus");

  if (!fileInput) return;
  const file = fileInput.files[0];

  if (!file) {
    msg.style.display = "block";
    msg.className = "error";
    msg.innerText = "❌ Chưa chọn file Excel";
    return;
  }

  const formData = new FormData();
  formData.append("excel", file);

  try {
    msg.style.display = "block";
    msg.className = "";
    msg.innerText = "⏳ Đang upload file...";

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    msg.className = "success";
    msg.innerText = "✅ Upload thành công " + data.total + " dòng dữ liệu";

  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.innerText = "❌ Upload thất bại";
  }
}


/* =========================
   LOGIN SYSTEM
========================= */

function login() {

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const msg = document.getElementById("loginMsg");

  if (!username || !password) return;

  const u = username.value.trim();
  const p = password.value.trim();

  if (u === "nooronanpao" && p === "nooronanpaonhontrach") {

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
   AUTH CHECK (FIXED - NO CRASH SEARCH)
========================= */

window.addEventListener("load", () => {

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

});


/* =========================
   LOGOUT
========================= */

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "/login.html";
}
