// src/components/Home.jsx
import React, { useState, useRef, useEffect } from 'react';

function Home() {
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [foodToday, setFoodToday] = useState('');
  const [exerciseToday, setExerciseToday] = useState('');
  const [exercisePerWeek, setExercisePerWeek] = useState('');
  const [smokeVape, setSmokeVape] = useState('');
  const [cholesterolMeds, setCholesterolMeds] = useState('');
  const [otherMeds, setOtherMeds] = useState('');

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
    <div className="home-container">
      <h1>Welcome to your Health Assessment!</h1>
      <p>Please answer the questions by voice to monitor your health habits and cholesterol levels.</p>

      <div className="doll-container">
        <img src="/Lili_mascot.png" alt="Friendly Doll" className="doll-image" />
        <div className="text-bubble">
          <p className="question-text">{currentQuestion.question}</p>

          {currentQuestion.inputType === 'number' || currentQuestion.inputType === 'text' ? (
            <div className="input-area">
              {currentQuestion.inputType === 'number' ? (
                <input
                  type="number"
                  id={`input-${currentQuestionIndex}`}
                  value={currentQuestion.stateValue}
                  placeholder={currentQuestion.placeholder}
                  readOnly // Make input read-only, voice input will update state directly
                />
              ) : (
                <textarea
                  id={`input-${currentQuestionIndex}`}
                  value={currentQuestion.stateValue}
                  placeholder={currentQuestion.placeholder}
                  readOnly // Make textarea read-only, voice input will update state directly
                />
              )}
              <button type="button" onClick={startRecording} disabled={isRecording}>
                {isRecording ? 'Recording...' : 'Start Voice Input'}
              </button>
              <button type="button" onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
              </button>
              {transcript && isRecording && <p className="transcript-text">Transcribing: {transcript}</p>}
              {currentQuestion.stateValue && !isRecording && <p className="voice-input-display">Voice Input: {currentQuestion.stateValue}</p>}

            </div>
          ) : currentQuestion.inputType === 'select' ? (
            <div className="input-area">
              <select
                id={`select-${currentQuestionIndex}`}
                value={currentQuestion.stateValue}
                onChange={(e) => currentQuestion.stateSetter(e.target.value)}
              >
                {currentQuestion.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button type="button" onClick={moveToPreviousQuestion}>
                Previous
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 ? (
              <button type="button" onClick={moveToNextQuestion}>
                Next
              </button>
            ) : (
              <button type="submit" onClick={handleSubmit}>
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