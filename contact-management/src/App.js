import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactsTable from './components/ContactsTable';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (contact) => {
    console.log('Edit contact:', contact);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="container">
      <h1>Contact Management</h1>
      <ContactForm fetchContacts={fetchContacts} />
      <ContactsTable contacts={contacts} onDelete={handleDelete} onEdit={handleEdit} />
      
      
      <div className="watermark">
        Presented by Ritik Awasthi<br />
        ritikawasthi55@gmail.com
      </div>
    </div>
  );
};

export default App;
