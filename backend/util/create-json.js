const { parse } = require('csv-parse/sync'); 
const fs = require('fs');
const fsp = require('fs').promises; // Promise-based FS

const csvFilePath = 'Mobiles-Dataset-(2025).csv';
const jsonFilePath = 'phones.json';

async function convertCsvToJson() {
  try {
    // 1. Read the CSV file
    const content = fs.readFileSync(csvFilePath);

    // 2. Parse CSV into an Array of Objects
    const records = parse(content, { columns: true });
    console.log(`Parsed ${records.length} records.`);

    // 3. IMPORTANT: Convert the Object to a String
    const jsonString = JSON.stringify(records, null, 2); // 'null, 2' makes it readable (pretty-print)

    // 4. Write the file using the Promise version
    await fsp.writeFile(jsonFilePath, jsonString);
    
    console.log('Success! The JSON file has been saved.');
  } catch (err) {
    console.error('Error during conversion:', err.message);
  }
}

convertCsvToJson();

