const fs = require('fs');
const path = require('path');
const axios = require('axios');

// List your payload JSON files here (adjust filenames as per your files)
const payloadFiles = [
  'payloads/conversation_1_message_1.json',
  'payloads/conversation_1_message_2.json',
  'payloads/conversation_1_status_1.json',
  'payloads/conversation_1_status_2.json',
  'payloads/conversation_2_message_1.json',
  'payloads/conversation_2_message_2.json',
  'payloads/conversation_2_status_1.json',
  'payloads/conversation_2_status_2.json'
];

const apiUrl = 'http://localhost:5000/api/process-payload';

async function processPayloadFiles() {
  for (const file of payloadFiles) {
    try {
      const filePath = path.join(__dirname, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const jsonPayload = JSON.parse(rawData);

      const response = await axios.post(apiUrl, jsonPayload);
      console.log(`Processed ${file}: ${response.data}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
}

processPayloadFiles();
