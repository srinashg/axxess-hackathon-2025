// src/components/Home.jsx
import React, { useState } from 'react';

function Home() {
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [foodToday, setFoodToday] = useState('');
  const [exerciseToday, setExerciseToday] = useState('');
  const [exercisePerWeek, setExercisePerWeek] = useState('');
  const [smokeVape, setSmokeVape] = useState('');
  const [cholesterolMeds, setCholesterolMeds] = useState('');
  const [otherMeds, setOtherMeds] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real application, you would send this data to your backend for processing and assessment.
    // For now, we'll just log the data to the console.
    console.log('Health Assessment Form submitted with:', {
      hdl,
      ldl,
      foodToday,
      exerciseToday,
      exercisePerWeek,
      smokeVape,
      cholesterolMeds,
      otherMeds,
    });
    alert('Health Assessment form submitted (no backend yet, check console for data)'); // Just for demonstration
  };

  return (
    <div>
      <h1>Welcome to your Health Assessment!</h1>
      <p>Please fill out the form below to monitor your health habits and cholesterol levels.</p>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Cholesterol Levels (mg/dL)</legend>
          <div>
            <label htmlFor="hdl">HDL Cholesterol:</label>
            <input
              type="number"
              id="hdl"
              value={hdl}
              onChange={(e) => setHdl(e.target.value)}
              placeholder="Enter HDL level"
              required
            />
          </div>
          <div>
            <label htmlFor="ldl">LDL Cholesterol:</label>
            <input
              type="number"
              id="ldl"
              value={ldl}
              onChange={(e) => setLdl(e.target.value)}
              placeholder="Enter LDL level"
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Health Habits Questionnaire</legend>
          <div>
            <label htmlFor="foodToday">What food did you eat today?</label>
            <textarea
              id="foodToday"
              value={foodToday}
              onChange={(e) => setFoodToday(e.target.value)}
              placeholder="List the food items"
            />
          </div>
          <div>
            <label htmlFor="exerciseToday">How long did you exercise today?</label>
            <input
              type="text"
              id="exerciseToday"
              value={exerciseToday}
              onChange={(e) => setExerciseToday(e.target.value)}
              placeholder="e.g., 30 minutes, 1 hour, None"
            />
          </div>
          <div>
            <label htmlFor="exercisePerWeek">How long do you exercise per week?</label>
            <input
              type="text"
              id="exercisePerWeek"
              value={exercisePerWeek}
              onChange={(e) => setExercisePerWeek(e.target.value)}
              placeholder="e.g., 2 hours, 5 hours, Less than 1 hour"
            />
          </div>
          <div>
            <label htmlFor="smokeVape">Do you smoke/vape?</label>
            <select
              id="smokeVape"
              value={smokeVape}
              onChange={(e) => setSmokeVape(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label>Are you on any medications?</label>
            <div>
              <label htmlFor="cholesterolMeds">Cholesterol Medications?</label>
              <select
                id="cholesterolMeds"
                value={cholesterolMeds}
                onChange={(e) => setCholesterolMeds(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="otherMeds">Other Medications?</label>
              <select
                id="otherMeds"
                value={otherMeds}
                onChange={(e) => setOtherMeds(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </fieldset>

        <button type="submit">Submit Assessment</button>
      </form>
    </div>
  );
}

export default Home;