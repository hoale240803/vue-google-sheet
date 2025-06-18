// backend/index.js
const { google } = require("googleapis");
const path = require("path");
const serviceAccount = require(path.join(__dirname, "service-account.json"));

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
const PORT = 3001;

app.use(cors()); // allow Vue frontend to access API
app.use(express.json()); // for parsing application/json

app.get("/api/sheet", async (req, res) => {
  const { GOOGLE_API_KEY, SPREADSHEET_ID, SHEET_RANGE } = process.env;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const values = response.data.values;

    const headers = values[0];
    const rows = values.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || "";
      });
      return normalizeKeysToCamelCase(obj);
    });

    res.json(rows);
  } catch (error) {
    console.error("Error fetching sheet data:", error.message);
    res.status(500).json({ error: "Failed to fetch sheet data" });
  }
});

async function appendToSheet(values) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = "Sheet1"; // or your actual sheet name

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

app.post("/api/sheet", async (req, res) => {
  const { id, name, email, phone, address, transactionAmount } = req.body;
  if (
    !id ||
    !name ||
    !email ||
    !phone ||
    !address ||
    transactionAmount === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    await appendToSheet([id, name, email, phone, address, transactionAmount]);
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Failed to add customer" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`);
});

function toCamelCase(str) {
  return str
    .replace(/[_-](\w)/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(\w)/, (_, c) => (c ? c.toLowerCase() : ""));
}

function normalizeKeysToCamelCase(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [toCamelCase(k), v])
  );
}
