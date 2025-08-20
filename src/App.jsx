import React, { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import useSpeechToText from './hooks/useSpeechToText'
import useTextToSpeech from './hooks/useTextToSpeech';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

function App() {

  let keywords = ['create', 'insert', 'add', 'implement', 'generate', 'compose', 'form', 'formulate', 'setup', 'update', 'set', 'change', 'alter', 'modify', 'edit', 'correct', 'make'];
  const [keywordIndex, setKeywordIndex] = useState(-1);
  const [flag, setFlag] = useState(true);
  const [otFlag, setOtflag] = useState(true);
  const [globalConfirm, setGlobalConfirm] = useState(true);
  const [confirmFlag, setConfirmFlag] = useState(false);
  const [valSet, setValset] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const [caseComment, setCaseComment] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseStatus, setCaseStatus] = useState('');

  const [temp, setTemp] = useState('');

  const [textInput, setTextInput] = useState('');

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [bearerToken, setbearerToken] = useState('');
  const [instanceUrl, setinstanceUrl] = useState('');
  
  const [showMicrophone, setShowMicrophone] = useState(false);

  const { isListening, transcript, startListening, stopListening, stopListening2 } = useSpeechToText({ continuous: true })

  const { speak } = useTextToSpeech();

  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    chrome.storage.sync.get(['voiceFeedbackEnabled', 'volume', 'taskConfirmationEnabled'], (result) => {
      setVoiceFeedbackEnabled(result.voiceFeedbackEnabled !== undefined ? result.voiceFeedbackEnabled : true);
      setVolume(result.volume !== undefined ? result.volume : 50);
      setGlobalConfirm(result.taskConfirmationEnabled !== undefined ? result.taskConfirmationEnabled : true);
    });
  }, []);

  const getEnvVars = () => {
    chrome.storage.sync.get(['bearerToken', 'instanceUrl'], function (result) {
      setbearerToken(result.bearerToken);
      setinstanceUrl(result.instanceUrl);
    });
  }

  const startStopListening = () => {
    setIsSpeaking(!isSpeaking);
    isListening ? stopVoiceInput() : startListening()
  }
 

  const stopVoiceInput = () => {
    stopListening()
    setTextInput(transcript)
    if(confirmFlag){
      setOtflag(!otFlag);
    } else {
      TaskToDo()
    }
  }

  useEffect(() => {
    getEnvVars();
    chrome.storage.sync.get(['bearerToken', 'instanceUrl'], (result) => {
      if (result.bearerToken && result.instanceUrl) {
        setShowMicrophone(true);
      }
    });
    
    if(!valSet || !globalConfirm){
      let cNumber = null;
      const cleanedTranscript = transcript.replace(/[^a-zA-Z0-9]/g, "");
      const match = cleanedTranscript.match(/case[number]+(\d+)/i);
      if (match) {
        cNumber = "1" + match[1];
      }
      setCaseNumber(cNumber);
      if (keywordIndex >= 0 && keywordIndex <= 8) {
        let comment = 'No Comment';
        const commentIndex = transcript.indexOf("comment");
        if (commentIndex !== -1) {
          comment = transcript.substring(commentIndex + "comment".length + 1);
        }
        setCaseComment(comment);
        setValset(true);
        if (globalConfirm) {
          speak(`Are you sure you want to add a Case comment`);
          setConfirmFlag(true);
        }
      } else if (keywordIndex > 8 && keywordIndex <= 16) {
        let cStatus = 'No Status';
        const caseStatusIndex = transcript.indexOf("status to");
        if (caseStatusIndex !== -1) {
          cStatus = transcript.substring(caseStatusIndex + "status to".length + 1);
          cStatus = cStatus.trim().replace(/[^\w\s]+-$/g, "");
          cStatus = cStatus.charAt(0).toUpperCase() + cStatus.slice(1);
        }
        setCaseStatus(cStatus);
        setValset(true);
        if (globalConfirm) {
          speak(`Are you sure you want to update the Case Status`);
          setConfirmFlag(true);
        }
      }
    }

    if(!globalConfirm){
      setValset(!valSet);
      if (keywordIndex >= 0 && keywordIndex <= 8) {
        addCaseComment(caseNumber,caseComment);
      } else if (keywordIndex > 8 && keywordIndex <= 16) {
        updateCaseStatus(caseNumber,caseStatus);
      }
    }

    if(globalConfirm && valSet && !confirmFlag){
      setValset(!valSet);
      if (keywordIndex >= 0 && keywordIndex <= 8) {
        addCaseComment(caseNumber,caseComment);
      } else if (keywordIndex > 8 && keywordIndex <= 16) {
        updateCaseStatus(caseNumber,caseStatus);
      }
    }

  }, [flag]);

  useEffect(() => {
    if(confirmFlag && globalConfirm){
      if (transcript.includes('yes')) {
       setConfirmFlag(false);
       setFlag(!flag);
      } else if (transcript.includes('no')) {
        setConfirmFlag(false);
        setValset(!valSet);
        speak('Operation cancelled.');
      } else {
        speak('Please say yes or no to confirm or cancel.');
      }
    } 
  }, [otFlag]);

  const matchesSequence = (inputString) => {
    const match = keywords.findIndex(seq => inputString.toLowerCase().includes(seq.toLowerCase()));

    if (match >= 0) {
      setInvalid(false);
      setKeywordIndex(match);
      setFlag(!flag);
    } else {
      if(!invalid){
        setInvalid(true);
        speak('This was not a valid command, Please try again');
      } else {
        speak('This was not a valid command, Please check the Help section for more information on valid commands');
      }
      
    }
  }


  const TaskToDo = () => {
    matchesSequence(transcript)
  };

  const addCaseComment = async (cNumber, cComment) => {
    
    const bodyData = `{
      "caseNumber" : "${cNumber}",
      "caseComment" : "${cComment}"
  }`;
    try {
      const response = await fetch(
        `${instanceUrl}/services/apexrest/SfVoiceAssistantCaseCommentHandler`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );
      const data = await response.json();
      const stat = response.status;
      if (stat === 200) {
        speak(`Comment added on Case`);
      } else {
        speak(`Case Comment was not added`);
      }
    } catch (error) {
      setTemp(error);
    }
  };

  const updateCaseStatus = async (cNumber, cStatus) => {
    
    const bodyData = `{
      "caseNumber" : "${cNumber}",
      "status" : "${cStatus}"
  }`;
    try {
      const response = await fetch(
        `${instanceUrl}/services/apexrest/SfVoiceAssistantCaseHandler`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );
      const data = await response.json();
      const stat = response.status;
      if (stat === 200) {
        speak(`The Case was Updated`);
      } else {
        speak(`The Case was not updated`);
      }
    } catch (error) {
      setTemp(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: 'column',
        margin: "0 auto",
        textAlign: "center",
      }}
    >

      <div className="container">
        <div className={`sticks-container left ${isSpeaking ? 'speaking' : ''}`}>
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
        </div>

        {!showMicrophone && <p className='login-message'>Please login inside settings to continue</p>}
        {showMicrophone && <FontAwesomeIcon icon={faMicrophone} className={`mic-icon ${isSpeaking ? 'speaking' : ''}`} onClick={() => {
          startStopListening();
        }} />}
        {showMicrophone && <div className={`sticks-container right ${isSpeaking ? 'speaking' : ''}`}>
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
        </div>}
      </div>
      <div>
        <textarea
          className='transcript-box'
          disabled={isListening}
          value={transcript}
          onChange={(e) => {
            setTextInput(e.target.value)
          }}
        />
      </div>
    </div>
  );
}

export default App;