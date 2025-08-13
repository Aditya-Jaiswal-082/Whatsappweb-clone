const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  wa_id: { type: String, required: true },          // WhatsApp user ID
  name: String,                                      // Contact name
  from: String,                                      // Sender's phone number
  to: String,                                        // Recipient phone number (your API number)
  text: String,                                      // Message content text
  type: String,                                      // Message type (e.g., "text")
  timestamp: Date,                                   // Message timestamp
  id: { type: String, unique: true },                // Unique WhatsApp message ID
  status: { type: String, default: "sent" },        // Message status (sent/delivered/read)
  meta_msg_id: String                                // ID for matching status updates
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
