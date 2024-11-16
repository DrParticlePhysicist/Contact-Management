const express = require('express');
const cors = require('cors');
const knex = require('knex');

// Initialize Knex with SQLite
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './contacts.db', // Path to the SQLite database file
  },
  useNullAsDefault: true, // Required for SQLite
});

// Create the `contacts` table if it doesn't exist
db.schema.hasTable('contacts').then((exists) => {
  if (!exists) {
    return db.schema.createTable('contacts', (table) => {
      table.increments('id'); // Auto-incrementing ID
      table.string('firstName');
      table.string('lastName');
      table.string('email');
      table.string('phone');
      table.string('company');
      table.string('jobTitle');
    });
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// Get all contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await db('contacts').select('*');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Add a contact
app.post('/contacts', async (req, res) => {
  const { firstName, lastName, email, phone, company, jobTitle } = req.body;
  try {
    const newContact = await db('contacts').insert({
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

// Edit a contact
app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, company, jobTitle } = req.body;
  try {
    await db('contacts').where({ id }).update({
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
    });
    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete a contact
app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db('contacts').where({ id }).del();
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
