// backend/index.js
const { google } = require("googleapis");

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
const PORT = 3001;

// const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
// if (!serviceAccountBase64) {
//   throw new Error("GOOGLE_SERVICE_ACCOUNT env variable is not set");
// }
// const serviceAccount = JSON.parse(
//   Buffer.from(serviceAccountBase64, "base64").toString("utf8")
// );

app.use(cors()); // allow Vue frontend to access API
app.use(express.json()); // for parsing application/json

const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
if (!serviceAccountBase64) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT environment variable is not set");
}

let serviceAccount;
try {
  const decodedJson = Buffer.from(serviceAccountBase64, "base64").toString(
    "utf8"
  );
  console.log("Decoded JSON:", decodedJson); // Debug: Log the decoded JSON
  serviceAccount = JSON.parse(decodedJson);
  console.log("Parsed Service Account:", serviceAccount); // Debug: Log the parsed object
} catch (error) {
  throw new Error(
    "Failed to decode or parse GOOGLE_SERVICE_ACCOUNT: " + error.message
  );
}

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

async function updateSheetRow(rowIndex, values) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Row index is 1-based in Google Sheets, and we need to skip the header row
  // So if we want to update customer with id=1, it should be in row 2 (1-based)
  const range = `Sheet1!A${rowIndex + 1}:F${rowIndex + 1}`; // Assuming 6 columns (A-F)

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

async function findCustomerRowIndex(customerId) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = process.env.SHEET_RANGE;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = response.data.values;
  if (!values || values.length <= 1) {
    return -1; // No data or only headers
  }

  // Skip header row (index 0), search from row 1 onwards
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString() === customerId.toString()) {
      return i + 1; // Return 1-based row index for Google Sheets
    }
  }

  return -1; // Customer not found
}

async function deleteFromSheet(customerId) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // First, get all data to find the row number
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:Z",
  });

  const values = response.data.values;
  if (!values || values.length === 0) {
    throw new Error("No data found in sheet");
  }

  // Find the row with matching customer ID (assuming ID is in column A)
  let rowToDelete = -1;
  for (let i = 1; i < values.length; i++) {
    // Start from 1 to skip header
    if (values[i][0] === String(customerId)) {
      rowToDelete = i + 1; // Google Sheets is 1-indexed
      break;
    }
  }

  if (rowToDelete === -1) {
    throw new Error(`Customer with ID ${customerId} not found`);
  }

  // Delete the row
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // assuming first sheet
              dimension: "ROWS",
              startIndex: rowToDelete - 1, // 0-indexed for API
              endIndex: rowToDelete, // exclusive end
            },
          },
        },
      ],
    },
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

app.put("/api/sheet/:id", async (req, res) => {
  const customerId = req.params.id;
  const { name, email, phone, address, transactionAmount } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    transactionAmount === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Find the row index for this customer
    const rowIndex = await findCustomerRowIndex(customerId);

    if (rowIndex === -1) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Update the row with new values
    await updateSheetRow(rowIndex, [
      customerId,
      name,
      email,
      phone,
      address,
      transactionAmount,
    ]);
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

app.delete("/api/sheet/:id", async (req, res) => {
  const customerId = req.params.id;
  if (!customerId) {
    return res.status(400).json({ error: "Customer ID is required" });
  }
  try {
    await deleteFromSheet(customerId);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
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
