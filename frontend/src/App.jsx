import { useState, useRef, useEffect } from "react";
import lilip from "./owl-lilip.avif";
import { ClipLoader } from "react-spinners";

function App() {
  const [name, setName] = useState('');
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [foodToday, setFoodToday] = useState('');
  const [exerciseToday, setExerciseToday] = useState('');
  const [exercisePerWeek, setExercisePerWeek] = useState('');
  const [smokeVape, setSmokeVape] = useState('');
  const [cholesterolMeds, setCholesterolMeds] = useState('');
  const [otherMeds, setOtherMeds] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [parsedResponse, setParsedResponse] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = [
    { question: `Hello! What's your name?`, stateSetter: setName, stateValue: name, inputType: 'text', placeholder: 'First name'},
    { question: 'Can you tell me what your HDL was from your last lipid panel screening?', stateSetter: setHdl, stateValue: hdl, inputType: 'number', placeholder: 'HDL level' },
    { question: 'How about your LDL Cholesterol level?', stateSetter: setLdl, stateValue: ldl, inputType: 'number', placeholder: 'LDL level' },
    { question: 'What food did you eat today?', stateSetter: setFoodToday, stateValue: foodToday, inputType: 'text', placeholder: 'Food items' },
    { question: 'How long did you exercise today? What did you do?', stateSetter: setExerciseToday, stateValue: exerciseToday, inputType: 'text', placeholder: 'e.g., 30 minutes' },
    { question: 'How long do you exercise per week? What are your normal exercise activities?', stateSetter: setExercisePerWeek, stateValue: exercisePerWeek, inputType: 'text', placeholder: 'e.g., 2 hours' },
    {
      question: 'Do you smoke or vape? If so, how often?',
      stateSetter: setSmokeVape,
      stateValue: smokeVape,
      inputType: 'text',
      options: [{ value: '', label: 'Select' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
    {
      question: 'Are you on cholesterol medications? If so, can you please specify which one(s)?',
      stateSetter: setCholesterolMeds,
      stateValue: cholesterolMeds,
      inputType: 'text',
      options: [{ value: '', label: 'Select' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
    {
      question: 'Are you on other medications? If so, can you please specify which one(s)?',
      stateSetter: setOtherMeds,
      stateValue: otherMeds,
      inputType: 'text',
      options: [{ value: '', label: 'Select' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
  ];

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

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
    
      setTranscript((prevTranscript) => {
        console.log("Transcript on end:", prevTranscript);
        console.log("State Setter Function:", questions[currentQuestionIndex].stateSetter);
        questions[currentQuestionIndex].stateSetter(prevTranscript);
        return prevTranscript; // Return the state to ensure consistency
      });
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

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    setLoading(true);
    console.log(apiKey);

    const healthData = {
      name,
      hdl,
      ldl,
      foodToday,
      exerciseToday,
      exercisePerWeek,
      smokeVape,
      cholesterolMeds,
      otherMeds
    };

    console.log("Health Assessment Data:", healthData);
    alert("Health data submitted! Please wait a few seconds for our analysis. Press 'OK' to continue...")

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              "content": "You are a wise, friendly owl who provides health advice in simple terms. When given inputs about a person’s current habits, goals, or challenges, offer a regimen to follow and provide critiques or suggestions for improvement. Keep it practical, insightful, and easy to understand. Structure the response like this: {\"greeting\": \"<greeting message>\", \"suggestions\": [{\"title\": \"<suggestion title>\", \"details\": \"<suggestion details>\"}, {...}, {...}]}. Treat the user as a friend (make every greeting include Hello! as well as their). Be sure to specify if there are any conflictions with medications—really do a thorough analysis, but provide a user-friendly answer."
            },
            {
              role: "user",
              content: `Here is the user's health data: ${JSON.stringify(healthData)}. Provide feedback for a healthier lifestyle.`
            }
          ]
        }),
      });
  
      const data = await response.json();
      const feedbackMessage = data.choices[0].message.content;
      const parsedData = JSON.parse(feedbackMessage);
      setParsedResponse(parsedData);
    } catch (error) {
      console.error("Error:", error);
      setApiResponse("Failed to retrieve feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="mainContent">
        <h1>Lilip</h1>
        <p id="tagline">Your friendly guide to healthy cholesterol, every step of the way!</p>
        <div className="container">
          <div id="widget">
            <div className="imageContainer">
              <img id="lilip" src={lilip} />
            </div>
            <div className="inputContainer">
              <p className="question">{currentQuestion.question}</p>
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
        {/* Show loading message while waiting for response */}
        {loading && <ClipLoader size={50} color="#4A90E2" />}

        {parsedResponse && !loading && (
      <div className="api-response" style={{ backgroundColor: 'white', color: 'black', borderRadius: '10px', padding: '15px', marginTop: '20px', maxWidth: '400px', textAlign: 'center', marginBottom: '30px' }}>
        <h3>{parsedResponse.greeting}</h3>
        {parsedResponse.suggestions && parsedResponse.suggestions.length > 0 && (
      <div>
        {parsedResponse.suggestions.map((suggestion, index) => (
          <div key={index} style={{ marginBottom: '15px', padding: '1em' }}>
            <h4>{suggestion.title}</h4>
            <p>{suggestion.details}</p>
          </div>
        ))}
      </div>
    )}
  </div>
)}
      </div>
    </>
  );
}

export default App;