// src/components/Home.jsx
import React, { useState, useRef, useEffect } from 'react';

function Home() {
  /*
  defines the state of each question. the 'set' methods (right) take the value of the input and set the value to the variable (left)
  [hdl, setHdl]: setHdl = 58 means hdl = 58, which is updated in useState into the textbox
  */
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [foodToday, setFoodToday] = useState('');
  const [exerciseToday, setExerciseToday] = useState('');
  const [exercisePerWeek, setExercisePerWeek] = useState('');
  const [smokeVape, setSmokeVape] = useState('');
  const [cholesterolMeds, setCholesterolMeds] = useState('');
  const [otherMeds, setOtherMeds] = useState('');

  /*
  useState(0) means the question index starts with index 0, which is the first question
  some questions are recorded, and others are binary inputs
  */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = [
    { question: 'What is your HDL Cholesterol level?', stateSetter: setHdl, stateValue: hdl, inputType: 'number', placeholder: 'HDL level' },
    { question: 'What is your LDL Cholesterol level?', stateSetter: setLdl, stateValue: ldl, inputType: 'number', placeholder: 'LDL level' },
    { question: 'What food did you eat today?', stateSetter: setFoodToday, stateValue: foodToday, inputType: 'text', placeholder: 'Food items' },
    { question: 'How long did you exercise today?', stateSetter: setExerciseToday, stateValue: exerciseToday, inputType: 'text', placeholder: 'e.g., 30 minutes' },
    { question: 'How long do you exercise per week?', stateSetter: setExercisePerWeek, stateValue: exercisePerWeek, inputType: 'text', placeholder: 'e.g., 2 hours' },
    {
      question: 'Do you smoke or vape?',
      stateSetter: setSmokeVape,
      stateValue: smokeVape,
      inputType: 'select',
      options: [{ value: '', label: 'Select' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
    {
      question: 'Are you on cholesterol medications?',
      stateSetter: setCholesterolMeds,
      stateValue: cholesterolMeds,
      inputType: 'select',
      options: [{ value: '', label: 'Select' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
    {
      question: 'Are you on other medications?',
      stateSetter: setOtherMeds,
      stateValue: otherMeds,
      inputType: 'select',
      options: [{ value: '', label: 'Select' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
  ];

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  /*
  handles side effects = anything in the outside world (the internet)
  some browsers don't support speech recognition, so we check for that
  otherwise continue speech recognition like normal
  */
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition is not supported in this browser.');
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognitionRef.current.onresult = (event) => {
      const audioTranscript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      setTranscript(audioTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (transcript) {
        console.log("Transcript on end:", transcript); // Debugging log
        console.log("State Setter Function:", questions[currentQuestionIndex].stateSetter); // Debugging log
        questions[currentQuestionIndex].stateSetter(transcript); // Set state with transcript
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentQuestionIndex, questions]); // Effect dependency on currentQuestionIndex and questions

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real application, you would send this data to your backend.
    console.log('Health Assessment Data:', {
      hdl,
      ldl,
      foodToday,
      exerciseToday,
      exercisePerWeek,
      smokeVape,
      cholesterolMeds,
      otherMeds,
    });
    alert('Health Assessment submitted (no backend yet, check console for data)');
  };

  /*
  clicking the previous button moves to the previous question
  clicking the next button moves to the next question
  clicking the submit button submits the assessment
  */
  const currentQuestion = questions[currentQuestionIndex];

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="home-container" style={{ backgroundColor: '#B9243C', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <nav style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center' }}>
          <li style={{ marginLeft: '10px', marginRight: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
          <li style={{ marginLeft: '10px', marginRight: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>About</a></li>
          <li style={{ marginLeft: '10px', marginRight: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Services</a></li>
          <li style={{ marginLeft: '10px', marginRight: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact</a></li>
        </ul>
      </nav>

      <div style={{ textAlign: 'center', marginTop: '20px', color: 'white' }}>
        <h1>Welcome to your Health Assessment!</h1>
        <p>Please answer the questions by voice to monitor your health habits and cholesterol levels.</p>
      </div>

      <div className="doll-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
        <img src="/Lili_mascot.png" alt="Friendly Doll" className="doll-image" style={{ maxWidth: '200px', marginBottom: '20px' }} />
        <div className="text-bubble" style={{ backgroundColor: 'white', color: 'black', borderRadius: '15px', padding: '20px', marginBottom: '20px', maxWidth: '80%', textAlign: 'left' }}>
          <p className="question-text" style={{ fontWeight: 'bold', marginBottom: '10px' }}>{currentQuestion.question}</p>

          {currentQuestion.inputType === 'number' || currentQuestion.inputType === 'text' ? (
            <div className="input-area" style={{ marginBottom: '15px' }}>
              {currentQuestion.inputType === 'number' ? (
                <input
                  type="number"
                  id={`input-${currentQuestionIndex}`}
                  value={currentQuestion.stateValue}
                  placeholder={currentQuestion.placeholder}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: 'calc(100% - 22px)', marginBottom: '10px' }}
                // readOnly   - Removed readOnly for debugging
                />
              ) : (
                <textarea
                  id={`input-${currentQuestionIndex}`}
                  value={currentQuestion.stateValue}
                  placeholder={currentQuestion.placeholder}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: 'calc(100% - 22px)', marginBottom: '10px', height: '80px' }}
                // readOnly - Removed readOnly for debugging
                />
              )}
              <button type="button" onClick={startRecording} disabled={isRecording} style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', marginRight: '5px', cursor: 'pointer' }}>
                {isRecording ? 'Recording...' : 'Start Voice Input'}
              </button>
              <button type="button" onClick={stopRecording} disabled={!isRecording} style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
                Stop Recording
              </button>
              {transcript && isRecording && <p className="transcript-text" style={{ marginTop: '5px', fontSize: '0.9em', color: 'grey' }}>Transcribing: {transcript}</p>}
              {currentQuestion.stateValue && !isRecording && <p className="voice-input-display" style={{ marginTop: '5px', fontSize: '0.9em', color: 'grey' }}>Voice Input: {currentQuestion.stateValue}</p>}
            </div>
          ) : currentQuestion.inputType === 'select' ? (
            <div className="input-area" style={{ marginBottom: '15px' }}>
              <select
                id={`select-${currentQuestionIndex}`}
                value={currentQuestion.stateValue}
                onChange={(e) => currentQuestion.stateSetter(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' }}
              >
                {currentQuestion.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {currentQuestionIndex > 0 && (
              <button type="button" onClick={moveToPreviousQuestion} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer' }}>
                Previous
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 ? (
              <button type="button" onClick={moveToNextQuestion} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer' }}>
                Next
              </button>
            ) : (
              <button type="submit" onClick={handleSubmit} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;