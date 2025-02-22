// src/components/Home.jsx
import React, { useState } from 'react';

function Home() {
  // Mock medication data for now
  const [medications, setMedications] = useState([
    'Medication A',
    'Medication B',
    'Medication C',
  ]);

  const [newMedication, setNewMedication] = useState('');

  const handleAddMedication = () => {
    if (newMedication.trim() !== '') {
      setMedications([...medications, newMedication]);
      setNewMedication(''); // Clear input after adding
    }
  };

  const handleRemoveMedication = (indexToRemove) => {
    const updatedMedications = medications.filter((_, index) => index !== indexToRemove);
    setMedications(updatedMedications);
  };

  return (
    <div>
      <h1>Welcome, User!</h1> {/* Replace "User" with actual username if you implement user sessions later */}

      <h2>Your Medications</h2>

      {medications.length === 0 ? (
        <p>You are not currently tracking any medications.</p>
      ) : (
        <ul>
          {medications.map((medication, index) => (
            <li key={index}>
              {medication}
              <button onClick={() => handleRemoveMedication(index)} style={{ marginLeft: '10px' }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <input
          type="text"
          placeholder="Enter new medication"
          value={newMedication}
          onChange={(e) => setNewMedication(e.target.value)}
        />
        <button onClick={handleAddMedication} style={{ marginLeft: '10px' }}>Add Medication</button>
      </div>
    </div>
  );
}

export default Home;