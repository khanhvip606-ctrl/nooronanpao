const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* =========================
   ROOT LOGIN PAGE
========================= */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "login.html"
    )
  );

});

/* =========================
   MULTER STORAGE (FIX RENDER)
========================= */

const storage = multer.memoryStorage();

const upload = multer({
  storage
});

/* =========================
   PRODUCT DATA
========================= */

let products = [];

/* =========================
   UPLOAD EXCEL (FIX RENDER)
========================= */

app.post(
  "/upload",
  upload.single("excel"),
  (req, res) => {

    try {

      const workbook =
      XLSX.read(
        req.file.buffer,
        { type: "buffer" }
      );

      const sheetName =
      workbook.SheetNames[0];

      const firstSheet =
      workbook.Sheets[sheetName];

      const data =
      XLSX.utils.sheet_to_json(
        firstSheet
      );

      products = data;

      console.log(
        "TOTAL PRODUCTS:",
        products.length
      );

      res.json({

        message:
        "Upload thành công",

        total:
        products.length

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        error:
        "Lỗi đọc file Excel"

      });

    }

  }
);

/* =========================
   SAFE NUMBER
========================= */

const safeNumber = (v) => {

  const n = Number(

    String(v ?? "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .trim()

  );

  return isNaN(n)
    ? 0
    : n;

};

/* =========================
   SEARCH PRODUCT
========================= */

app.get("/search", (req, res) => {

  const keyword =
    req.query.name || "";

  if (!keyword) {
    return res.json([]);
  }

  const result =
    products.filter((p) => {

      const name =
        String(p["Name of goods"] || "")
        .toLowerCase();

      return name.includes(
        keyword.toLowerCase()
      );

    });

  const USD_RATE = 26000;
  const TWD_RATE = 840;

  const finalResult =
    result.map((p) => {

      const sellPrice =
        safeNumber(p["Unit price"]);

      const costRaw =
        safeNumber(p["Cost of goods sold"]);

      const gross =
        safeNumber(p["Gross profit"]);

      const rate =
        safeNumber(p["Gross profit rate"]);

      let quantity = 0;

      const keys =
        Object.keys(p || {});

      const qtyKey =
        keys.find(k =>
          k.toLowerCase().includes("kg")
          ||
          k.toLowerCase().includes("quantity")
        );

      if (qtyKey) {
        quantity =
          safeNumber(p[qtyKey]);
      }

      const sellPriceUSD =
        sellPrice / USD_RATE;

      const sellPriceTWD =
        sellPrice / TWD_RATE;

      const costUSD =
        costRaw / USD_RATE;

      const costTWD =
        costRaw / TWD_RATE;

      const profitUSD =
        gross / USD_RATE;

      const profitTWD =
        gross / TWD_RATE;

      const avgCost =
        quantity > 0
          ? costRaw / quantity
          : costRaw;

      return {

        product:
          p["Name of goods"] || "",

        sellPriceVND:
          safeNumber(sellPrice),

        sellPriceUSD:
          Number(sellPriceUSD.toFixed(2)),

        sellPriceTWD:
          Number(sellPriceTWD.toFixed(2)),

        costVND:
          safeNumber(costRaw),

        costUSD:
          Number(costUSD.toFixed(2)),

        costTWD:
          Number(costTWD.toFixed(2)),

        profitVND:
          safeNumber(gross),

        profitUSD:
          Number(profitUSD.toFixed(2)),

        profitTWD:
          Number(profitTWD.toFixed(2)),

        quantity:
          safeNumber(quantity),

        avgCost:
          Number(avgCost.toFixed(2)),

        avgGrossProfit:
          safeNumber(gross),

        avgGrossRate:
          rate + "%"

      };

    });

  console.log(
    "TOTAL RESULT:",
    finalResult.length
  );

  res.json(finalResult);

});

/* =========================
   ⭐ SUGGEST AUTOCOMPLETE (NEW)
========================= */

app.get("/suggest", (req, res) => {

  try {

    const keyword =
      (req.query.q || "").toLowerCase();

    if (!keyword) {
      return res.json([]);
    }

    const result =
      products
        .map(p => p["Name of goods"])
        .filter(name =>
          name &&
          name.toLowerCase().includes(keyword)
        )
        .slice(0, 10);

    res.json(result);

  } catch (err) {

    console.log("SUGGEST ERROR:", err);

    res.json([]);

  }

});

/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Server running on port",
    PORT
  );

});
