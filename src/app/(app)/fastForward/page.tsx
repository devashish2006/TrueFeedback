'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, Award, BarChart3, FileText, ThumbsUp, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


// Main component for creating polls
export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, questionText: '', type: 'SINGLE', options: ['', ''] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pollUrl, setPollUrl] = useState('');
  const [error, setError] = useState('');

  // Question type options - keeping UI labels the same but mapping to backend
  const questionTypes = [
    { value: 'SINGLE', label: 'Single Choice', icon: <Check size={16} /> },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: <Check size={16} /> },
    { value: 'AGREE_DISAGREE', label: 'Agree/Disagree', icon: <ThumbsUp size={16} /> },
    { value: 'RATING', label: 'Rating Scale', icon: <BarChart3 size={16} /> }
  ];
  
  const router = useRouter();


  // Add a new question
  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      questionText: '',
      type: 'SINGLE',
      options: ['', '']
    };
    setQuestions([...questions, newQuestion]);
  };

  // Remove a question
  const removeQuestion = (idToRemove) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== idToRemove));
    }
  };

  // Update question text
  const updateQuestionText = (id, text) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, questionText: text } : q)));
  };

  // Update question type
  const updateQuestionType = (id, type) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        // Initialize options array if changing to choice questions
        let options = q.options;
        if ((type === 'SINGLE' || type === 'MULTIPLE_CHOICE') && (!options || options.length < 2)) {
          options = ['', ''];
        }
        return { ...q, type, options };
      }
      return q;
    }));
  };

  // Add option to question
  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  // Remove option from question
  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = [...q.options];
        newOptions.splice(optionIndex, 1);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Update option text
  const updateOptionText = (questionId, optionIndex, text) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Submit the poll
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a poll title');
      setIsSubmitting(false);
      return;
    }
    
    // Check all questions have text
    for (const q of questions) {
      if (!q.questionText.trim()) {
        setError('All questions must have text');
        setIsSubmitting(false);
        return;
      }
      
      // Check options for choice questions
      if ((q.type === 'SINGLE' || q.type === 'MULTIPLE_CHOICE') && q.options) {
        for (const option of q.options) {
          if (!option.trim()) {
            setError('All options must have text');
            setIsSubmitting(false);
            return;
          }
        }
      }
    }
    
    // Format data for API - remove id field from questions
    const formattedQuestions = questions.map(({ id, ...rest }) => rest);
    
    try {
      const response = await fetch('/api/createPoll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          questions: formattedQuestions
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create poll');
      }
      
      setSuccessMessage('Poll created successfully!');
      setPollUrl(data.pollUrl || '');
      
      // Reset form after successful submission
      setTitle('');
      setDescription('');
      setQuestions([
        { id: 1, questionText: '', type: 'SINGLE', options: ['', ''] }
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-black py-3 sm:py-4 border-b border-orange-600/30">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-orange-500 text-lg sm:text-2xl font-bold">FastForwardPolls</span>
              <span className="ml-2 text-xs text-gray-400 hidden md:inline">by 
                <span className="text-orange-500"> True</span>
                <span className="text-white">Feedback</span>
                </span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => router.push('/organisationDashboard')}
                className="text-gray-300 hover:text-orange-500 text-xs sm:text-sm md:text-base px-2 py-1"
                >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/MyPolls')}
               className="text-gray-300 hover:text-orange-500 text-xs sm:text-sm md:text-base px-2 py-1">
               My Polls
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col space-y-3 mb-6 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Create New Poll</h1>
            <div className="flex items-center">
              <span className="text-orange-500 mr-2"><Award size={18} /></span>
              <span className="text-gray-300 text-sm">Premium Features</span>
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 bg-green-900/30 border border-green-600 text-green-400 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Check className="text-green-500 mr-2 flex-shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
              <p className="text-sm sm:text-base break-all">Your poll is available at: <a href={pollUrl} className="text-orange-500 hover:underline">{pollUrl}</a></p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-600 text-red-400 p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={18} />
                <span className="font-semibold text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Poll details */}
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FileText className="mr-2 text-orange-500 flex-shrink-0" size={18} />
                Poll Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-gray-300 mb-2 text-sm font-medium">
                    Title <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-3 sm:px-4 sm:py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                    placeholder="Enter poll title"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-gray-300 mb-2 text-sm font-medium">
                    Description <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-3 sm:px-4 sm:py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 text-base resize-none"
                    placeholder="Enter poll description"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                <h2 className="text-lg font-semibold text-white">
                  Questions <span className="text-orange-500">*</span>
                </h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center justify-center text-sm bg-gray-800 text-orange-500 px-4 py-3 rounded-md hover:bg-gray-700 active:bg-gray-600 transition-colors w-full sm:w-auto font-medium"
                >
                  <Plus size={16} className="mr-2" /> Add Question
                </button>
              </div>

              {questions.map((question, index) => (
                <div key={question.id} className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-medium text-base">Question {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-gray-400 hover:text-red-500 active:text-red-600 p-2 -m-2 transition-colors"
                      disabled={questions.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Question text */}
                    <div>
                      <label htmlFor={`question-${question.id}`} className="block text-gray-300 mb-2 text-sm font-medium">
                        Question Text
                      </label>
                      <input
                        type="text"
                        id={`question-${question.id}`}
                        value={question.questionText}
                        onChange={(e) => updateQuestionText(question.id, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-3 sm:px-4 sm:py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                        placeholder="Enter your question"
                      />
                    </div>

                    {/* Question type */}
                    <div>
                      <label className="block text-gray-300 mb-3 text-sm font-medium">
                        Question Type
                      </label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {questionTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => updateQuestionType(question.id, type.value)}
                            className={`flex items-center justify-start p-4 rounded-md border transition-colors text-left ${
                              question.type === type.value
                                ? 'bg-orange-600/20 border-orange-500 text-orange-500'
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 active:bg-gray-600'
                            }`}
                          >
                            <span className="mr-3 flex-shrink-0">{type.icon}</span>
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Options for choice questions */}
                    {(question.type === 'SINGLE' || question.type === 'MULTIPLE_CHOICE') && (
                      <div className="space-y-3">
                        <label className="block text-gray-300 mb-2 text-sm font-medium">
                          Options
                        </label>
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-3">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOptionText(question.id, optionIndex, e.target.value)}
                                className="flex-grow bg-gray-800 border border-gray-700 text-white px-3 py-3 sm:px-4 sm:py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="text-gray-400 hover:text-red-500 active:text-red-600 p-2 flex-shrink-0 transition-colors"
                                disabled={question.options.length <= 2}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="text-sm text-orange-500 hover:text-orange-400 active:text-orange-600 mt-3 flex items-center font-medium transition-colors"
                        >
                          <Plus size={16} className="mr-2" /> Add Option
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center bg-orange-600 text-white px-6 py-4 rounded-md hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto sm:ml-auto font-medium text-base transition-colors"
              >
                {isSubmitting ? (
                  <span>Creating Poll...</span>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Create Poll
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-4 sm:py-6 border-t border-orange-600/30">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 TrueFeedback. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-500 active:text-orange-600 text-xs sm:text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 active:text-orange-600 text-xs sm:text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 active:text-orange-600 text-xs sm:text-sm transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}