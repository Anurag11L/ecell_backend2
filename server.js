// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: Date,
  eventDescription: String,
  eventImages: String,
});

const Event = mongoose.model('Event', eventSchema);

// Save event data
app.post('/api/events', async (req, res) => {
  try {
    const eventData = req.body;
    const newEvent = new Event(eventData);
    await newEvent.save();
    res.status(201).json({ message: 'Event saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const allEvents = await Event.find();
    res.status(200).json(allEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update an event
app.put('/api/events/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  const eventData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete an event
app.delete('/api/events/:eventId', async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const result = await Event.deleteOne({ _id: eventId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
