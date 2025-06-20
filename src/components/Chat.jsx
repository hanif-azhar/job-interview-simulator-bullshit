import { useEffect, useRef, useState } from 'react';
import dialogue from '../data/dialogue.json'; // dialogue json already finished
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.cancel(); // Prevent overlap
  speechSynthesis.speak(utterance);
}

export default function Chat() {
  const [chatLog, setChatLog] = useState([
    { speaker: dialogue[0].speaker, text: dialogue[0].text }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [burn, setBurn] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    
  const lastMsg = chatLog[chatLog.length - 1];
  if (lastMsg?.speaker?.includes('HR')) {
    speak(lastMsg.text);
  }
}, [chatLog]);

  const handleResponse = (response) => {
    const newBurn = burn + response.burn;
    const nextIndex = currentIndex + 1;

    const newMessages = [
      ...chatLog,
      { speaker: 'You', text: response.text }
    ];

    if (dialogue[nextIndex]) {
      newMessages.push({
        speaker: dialogue[nextIndex].speaker,
        text: dialogue[nextIndex].text
      });
    }

    setChatLog(newMessages);
    setCurrentIndex(nextIndex);
    setBurn(newBurn);
  };

  const currentQuestion = dialogue[currentIndex];
  
if (!currentQuestion) {
  let endingText = '';
  if (burn < 50) {
    endingText = " You were too polite. They ghosted you professionally.";
  } else if (burn < 100) {
    endingText = " You made Greg sweat. But he rejected you anyway.";
  } else if (burn < 150) {
    endingText = " You melted the interview room. Greg rage-quit HR.";
  } else {
    endingText = "Greg reported you to HR AI Council. You're now banned from LinkedIn.";
  }
  return (
    <div className="bg-gray-900 text-white p-4 rounded shadow max-w-xl mx-auto text-center space-y-4">
      <h2 className="text-xl font-bold">Interview Complete</h2>
      <p>{endingText}</p>
      <p className="text-sm text-gray-400">Final Burn Meter: {burn}%</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
      >
        Try Again
      </button>
    </div>
  );
}

  return (
    <div className="bg-gray-800 p-4 rounded shadow max-w-xl mx-auto">
      <div className="h-64 overflow-y-auto space-y-2 mb-4">
        {chatLog.map((msg, i) => (
          <div key={i} className="p-2 rounded bg-gray-700">
            <strong>{msg.speaker}: </strong>{msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Show choices only if we still have responses left */}
      {currentQuestion?.responses && (
        <div className="space-y-2">
          {currentQuestion.responses.map((response, idx) => (
            <button
              key={idx}
              className="block w-full text-left p-2 bg-gray-600 hover:bg-red-500 rounded"
              onClick={() => handleResponse(response)}
            >
              {response.text}
            </button>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-gray-400 mt-4">
        Burn Meter: {burn}%
      </div>
    </div>
  );
}
