// AIzaSyBpAN8qJHQce7IH4jSr_KUh4Bt568QcYKk

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import "./GeminiAIQuery.css"

// const gemini_api_key = process.env.REACT_APP_GEMINI_AI_API_KEY; // Somehow not working 

function GeminiAIQuery() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setpromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBpAN8qJHQce7IH4jSr_KUh4Bt568QcYKk" //API Key
  );
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const getResponseForGivenPrompt = async () => {
    try {
      setError(false)
      setLoading(true)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(inputValue);
      
      const response = result.response.text();
      // const text = response.text();
      console.log(response)
      setpromptResponses([...promptResponses,{ inputValue, response }]);
      setInputValue('')
      setLoading(false)
    }
    catch (error) {
      console.log(error)
      console.log("GenAI: Something Went Wrong...");
      setLoading(false)
      setError(true)
    }
  }
    ;

  return (
    <div className="genai-container">
    
    {loading ? (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden genai-loading-text">GenAI Loading...</span>
       {/* // This message is shown while your answer to your prompt is being generated */}
        </div>
      </div>
    ) : (
      <div className='genai-response-container'>
        {promptResponses.map((item, index) => (
          <div key={index} >
            <div className="genai-user-prompt">
              <strong>Prompt:</strong> <ReactMarkdown>{item.inputValue}</ReactMarkdown>
            </div>
            
            <div className={`genai-response-text ${index === promptResponses.length - 1 ? 'fw-bold' : ''}`}>
              AI Response: <ReactMarkdown>{item.response}</ReactMarkdown>
            </div>
            {/* //the latest response shown in bold letters */}
          </div>
        ))}
      </div>
    )}

    {error && 
      <div className="genai-error-alert">
          Oops! There seems to be an unknown error. Try again later...
      </div>
    }

    {/* Gemini Input Section */}
    <div className="genai-input-section">
      <div className="textarea-section">
        <textarea
          type="textarea"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Need help with code? Ask here!"
          className="form-control"
        />
      </div>
      <div className="col-auto">
        <button 
          onClick={getResponseForGivenPrompt} 
          className="genai-send-btn"
          disabled={loading || !inputValue.trim()}>
            {loading ? "Loading..." : "Send" }
          </button>
      </div>
    </div>

  </div>
  
  );

}
export default GeminiAIQuery;