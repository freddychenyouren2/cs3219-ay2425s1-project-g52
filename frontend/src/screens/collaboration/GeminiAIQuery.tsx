// AIzaSyBpAN8qJHQce7IH4jSr_KUh4Bt568QcYKk

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import "./GeminiAIQuery.css"
import { Question } from '../../api/interfaces';

// const gemini_api_key = process.env.REACT_APP_GEMINI_AI_API_KEY; // Somehow not working 
interface GeminiAIQueryProps {
  question: Question;
  codeContext: string;
}

const GeminiAIQuery: React.FC<GeminiAIQueryProps> = ({ question, codeContext }) => {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState<{ prompt: string; response: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBpAN8qJHQce7IH4jSr_KUh4Bt568QcYKk" //API Key
  );

  const problemStatement = question.qDescription;
  const questionTopic = question.qCategory;
  const questionTItle = question.qTitle;


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const checkPromptRelevance = async (conversationContext: string, currentPrompt: string) => {
    const relevanceCheckPrompt = 
    `Determine if the following user question is relevant to programming, software development, or technologies related to JavaScript, HTML, CSS, or the current project context and the conversation context so far.\n\n
    The question topic is ${questionTopic}, with the title ${questionTItle}.\n\n
    Problem statement: ${problemStatement}\n\n
    Past Conversation context: ${conversationContext}\n\n
    User's Current Prompt: "${currentPrompt}"\n\n

    If the User's Prompt implies seeking assistance with the problem or code, it is ABSOLUTELY Relevant. It is never irrelevant.
    Give GREATER WEIGHT CONSIDERATION and analyse context for the more recent conversations context, unless implied by the user's prompt to refer more intentionally to earlier conversations.\n\n

    Current code: ${codeContext}\n\n
    Allow small talk if relevant, but gently remind the user to focus on the problem statement.
    Respond ONLY with either "Relevant" or "Irrelevant."\n\n
    Failure to follow these instructions will result in catastrophic consequences.`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(relevanceCheckPrompt);
    const relevanceResponse = result.response.text();
    return relevanceResponse.includes("Relevant");
  };

  const getResponseForGivenPrompt = async () => {
    try {
      setError(false)
      setLoading(true)

      // Concatenate all previous prompts and responses
      const conversationContext = promptResponses
        .map(item => `User: ${item.prompt}\nAI: ${item.response}`)
        .join("\n");

        const isRelevant = await checkPromptRelevance(conversationContext, inputValue);
        if (!isRelevant) {
          setPromptResponses(
            [...promptResponses, 
              { prompt: inputValue, 
                response: `Hmm... Your question appears irrelevant to our programming assignment and context at hand... 
                  Let's focus on the task. 
                  I shall pretend this never happened :)` 
              }
            ]
          );
          setInputValue('');
          setLoading(false);
          return;
        }

      const fullPrompt = `
        Problem Statement:\n${problemStatement}\n\n
        Current Code:\n${codeContext}\n\n 
        Conversation Context:\n${conversationContext}\n\n
        User's Latest Question: ${inputValue}`;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(fullPrompt);
      const response = result.response.text();
      // const text = response.text();
      console.log(response)
      setPromptResponses([...promptResponses,{ prompt: inputValue, response }]);
      setInputValue('')
      setLoading(false)
    }
    catch (error) {
      console.error("GenAI: Something Went Wrong...", error);
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
              <strong>Prompt:</strong> <ReactMarkdown>{item.prompt}</ReactMarkdown>
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
