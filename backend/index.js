require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Message = require("./models/Message");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// Process webhook payloads (insert or update messages)
app.post("/api/process-payload", async (req, res) => {
  try {
    const payload = req.body;
    const entry = payload.metaData.entry[0];
    const change = entry.changes[0].value;

    if (change.messages && change.messages.length > 0) {
      const m = change.messages[0];
      const contact = change.contacts[0];
      const existing = await Message.findOne({ id: m.id });
      if (!existing) {
        const newMsg = new Message({
          wa_id: contact.wa_id,
          name: contact.profile?.name || "",
          from: m.from,
          to: change.metadata.display_phone_number,
          text: m.text?.body || "",
          type: m.type,
          timestamp: new Date(Number(m.timestamp) * 1000),
          id: m.id,
          meta_msg_id: m.id,
          status: "sent"
        });
        await newMsg.save();
        return res.status(201).send("Message stored");
      }
      return res.status(200).send("Message already exists");
    }

    if (change.statuses && change.statuses.length > 0) {
      const statusObj = change.statuses[0];
      await Message.findOneAndUpdate(
        { meta_msg_id: statusObj.meta_msg_id },
        { status: statusObj.status }
      );
      return res.status(200).send("Message status updated");
    }

    res.status(400).send("No message or status found");
  } catch (error) {
    console.error("Error processing payload:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get conversations grouped by wa_id with messages sorted descendingly
app.get("/api/conversations", async (req, res) => {
  try {
    const convs = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          messages: { $push: "$$ROOT" }
        }
      }
    ]);
    res.json(convs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching conversations");
  }
});

// Get all messages for a specific user
app.get("/api/messages/:wa_id", async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id }).sort("timestamp");
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching messages");
  }
});

// Send new message (saved to DB, not actually sent)
app.post("/api/messages", async (req, res) => {
  try {
    const { wa_id, name, from, to, text } = req.body;
    const msg = new Message({
      wa_id,
      name,
      from,
      to,
      text,
      type: "text",
      timestamp: new Date(),
      id: Math.random().toString(36).substring(2, 15),
      meta_msg_id: Math.random().toString(36).substring(2, 15),
      status: "sent"
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send message");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
