import { useEffect, useState } from 'react';
import { Sparkles, Copy, Plus } from 'lucide-react';
import axios from '../auth/axios.js';
const questionTypes = ['General', 'Technical', 'Behavioral', 'System Design'];

export default function AIPanel({ sessionId }) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedType, setSelectedType] = useState('General');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  let array=""
  useEffect(()=>{
     const Q =localStorage.getItem('questions')
     if (Q) {
setGeneratedQuestions(JSON.parse(Q))
     }
  },[])

  const copyQuestion=(question)=>{
   navigator.clipboard.writeText(question)
  }


  const generateQuestions = async () => {
    try{
       setIsGenerating(true)
   const res = await axios.post('/api/aichat',{jobDescription,selectedType})
    console.log(res.data)
   array = res.data
 localStorage.setItem('questions',JSON.stringify(array))
 setGeneratedQuestions(array)
   setIsGenerating(false)


    }
   catch (err){
    console.log(err)
    setIsGenerating(false)
   }
  };

  return (
    <div className="h-[748px] flex flex-col bg-black text-white px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold">AI Question Generator</h3>
      </div>
<span className=" items-center text-1xl font-semibold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">
  Types of Question
</span>
      {/* Question Type Selector */}
      <div className="flex space-x-2  overflow-x-auto">


        {questionTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2  text-sm rounded-full border ${
              selectedType === type
                ? 'bg-blue-600  text-white border-blue-500'
                : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Job Description Input with Button */}
      <div className="relative w-full">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 pr-28 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateQuestions}
          disabled={!jobDescription.trim() || isGenerating}
          className="absolute btn-primary1 bottom-4 right-4 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? "..." : "Generate"}
        </button>
      </div>

      {/* Generated Questions */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {generatedQuestions.length > 0 ? (
          <div className="space-y-4">
            {generatedQuestions.map((q,i ) => (
              <div
                key={i}
                className="p-4 bg-gray-800/70 border border-gray-700 rounded-lg space-y-3 hover:bg-gray-700/70 transition-all"
              >
                <p className="text-white font-medium text-base">{q.question}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => copyQuestion(q.question)}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => addToSession(q.question)}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !isGenerating ? (
          <div className="text-center text-gray-500 mt-16">
            <Sparkles className="w-8 h-8 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-semibold">Ready to generate questions</p>
            <p className="text-sm">Enter job description and click generate</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
