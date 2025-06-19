import { useState } from 'react';
import { Sparkles, Copy, Plus } from 'lucide-react';

const questionTypes = [
  { id: 'mcq', name: 'Multiple Choice', description: 'Generate MCQ questions' },
  { id: 'coding', name: 'Live Coding', description: 'Programming challenges' },
  { id: 'system', name: 'System Design', description: 'Architecture questions' },
  { id: 'behavioral', name: 'Behavioral', description: 'Soft skills assessment' },
];

export default function AIPanel({ sessionId }) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedType, setSelectedType] = useState('mcq');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestions = async () => {
    if (!jobDescription.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockQuestions = {
      mcq: [
        {
          question: "What is the main purpose of React hooks?",
          options: ["State management", "Component lifecycle", "Both A and B", "None of the above"],
          correct: 2
        },
        {
          question: "Which HTTP method is used to update existing data?",
          options: ["GET", "POST", "PUT", "DELETE"],
          correct: 2
        }
      ],
      coding: [
        {
          title: "Two Sum Problem",
          description: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
          difficulty: "Easy"
        },
        {
          title: "Valid Parentheses",
          description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
          difficulty: "Easy"
        }
      ],
      system: [
        {
          title: "Design a URL Shortener",
          description: "Design a system like bit.ly that can shorten long URLs and redirect users to the original URL when accessed.",
          components: ["Load balancer", "Application servers", "Database", "Cache"]
        }
      ],
      behavioral: [
        {
          question: "Tell me about a time when you had to work with a difficult team member.",
          followUp: ["How did you handle the situation?", "What was the outcome?", "What would you do differently?"]
        },
        {
          question: "Describe a challenging project you worked on and how you overcame obstacles.",
          followUp: ["What specific challenges did you face?", "How did you prioritize tasks?"]
        }
      ]
    };

    setGeneratedQuestions(mockQuestions[selectedType] || []);
    setIsGenerating(false);
  };

  const copyQuestion = (question) => {
    const text = typeof question === 'string' ? question : JSON.stringify(question, null, 2);
    navigator.clipboard.writeText(text);
  };

  const addToSession = (question) => {
    console.log('Adding question to session:', question);
    // Implementation to add question to interview session
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50 glass-panel border-0 border-b border-gray-800/50">
        <h3 className="text-xl font-bold text-white flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">AI Question Generator</span>
        </h3>
      </div>

      {/* Input Section */}
      <div className="p-6 space-y-6 border-b border-gray-800/50">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Job Description / Role
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description or describe the role (e.g., Frontend Developer with React experience, 3+ years experience with Node.js and MongoDB...)"
            className="input-field w-full resize-none"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Question Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {questionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:bg-gray-800/50'
                }`}
              >
                <div className="font-semibold text-sm text-white">{type.name}</div>
                <div className="text-xs text-gray-400 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateQuestions}
          disabled={!jobDescription.trim() || isGenerating}
          className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Questions</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Questions */}
      <div className="flex-1 overflow-y-auto p-6">
        {generatedQuestions.length > 0 && (
          <div className="space-y-6">
            <h4 className="font-bold text-white text-lg">Generated Questions</h4>
            
            {generatedQuestions.map((question, index) => (
              <div key={index} className="glass-panel p-6 hover:bg-gray-800/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10">
                {selectedType === 'mcq' && (
                  <div>
                    <p className="font-semibold mb-4 text-white text-lg">{question.question}</p>
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex} 
                          className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                            optIndex === question.correct 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
                          }`}
                        >
                          <span className="font-semibold">{String.fromCharCode(65 + optIndex)}.</span> {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedType === 'coding' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-white text-lg">{question.title}</h5>
                      <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 font-medium">
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{question.description}</p>
                  </div>
                )}

                {selectedType === 'system' && (
                  <div>
                    <h5 className="font-bold text-white text-lg mb-3">{question.title}</h5>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{question.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {question.components.map((component, compIndex) => (
                        <span 
                          key={compIndex}
                          className="text-xs px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full border border-gray-600/50 font-medium"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedType === 'behavioral' && (
                  <div>
                    <p className="font-semibold mb-4 text-white text-lg">{question.question}</p>
                    <div className="text-sm text-gray-300">
                      <p className="font-semibold mb-2 text-blue-300">Follow-up questions:</p>
                      <ul className="list-disc list-inside space-y-2">
                        {question.followUp.map((followUp, followIndex) => (
                          <li key={followIndex} className="leading-relaxed">{followUp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-700/50">
                  <button
                    onClick={() => copyQuestion(question)}
                    className="btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => addToSession(question)}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {generatedQuestions.length === 0 && !isGenerating && (
          <div className="text-center text-gray-400 mt-12">
            <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-lg font-medium mb-2">Ready to Generate Questions</p>
            <p className="text-sm">Enter a job description and select a question type to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}