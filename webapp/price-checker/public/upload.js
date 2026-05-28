async function uploadExcel() {

  const fileInput = document.getElementById("excelFile");

  const msg = document.getElementById("msg");

  if (!fileInput.files.length) {

    msg.style.display = "block";

    msg.className = "error";

    msg.innerText = "❌ Please choose Excel file";

    return;
  }

  const formData = new FormData();

  formData.append("excel", fileInput.files[0]);

  try {

    msg.style.display = "block";

    msg.className = "";

    msg.innerText = "⏳ Uploading file...";

    const res = await fetch("/upload", {
      method:"POST",
      body:formData
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    msg.className = "success";

    msg.style.display = "block";

    msg.innerText = "✅ Upload successful";

  } catch(err) {

    msg.className = "error";

    msg.style.display = "block";

    msg.innerText = "❌ Upload failed";

    console.log(err);

  }

}