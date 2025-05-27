'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BarChart3, Twitter, Linkedin, Instagram, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

// Define TypeScript interfaces matching the backend schema
interface Question {
  _id: string;
  questionText: string;
  type: 'single' | 'multiple' | 'agree' | 'rating';
  options?: string[];
  ratingScale?: number;
}

interface Organization {
  _id: string;
  name: string;
  username: string;
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  responseCount: number;
  organization?: Organization;
  slug: string;
  createdAt: string;
}

interface Answer {
  questionId: string;
  selectedOptions?: string[];
  agreement?: boolean;
  rating?: number;
}

interface FormData {
  [questionId: string]: {
    selectedOptions?: string[];
    agreement?: boolean;
    rating?: number;
  };
}

export default function PollResponsePage() {
  const router = useRouter();
  const params = useParams();
  const { username, name, slug } = params;
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch poll data using the correct API endpoint
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the same URL pattern as your backend expects
        const response = await fetch(`/api/dataPoll?slug=${slug}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch poll');
        }
        
        const pollData = await response.json();
        setPoll(pollData);
        
        // Initialize form data with correct default values
        const initialFormData: FormData = {};
        pollData.questions.forEach((question: Question) => {
          switch (question.type) {
            case 'single':
            case 'multiple':
              initialFormData[question._id] = {
                selectedOptions: [],
              };
              break;
            case 'agree':
              initialFormData[question._id] = {
                agreement: undefined, // Not false by default to match validation
              };
              break;
            case 'rating':
              initialFormData[question._id] = {
                rating: undefined, // Not 0 by default to match validation
              };
              break;
          }
        });
        
        setFormData(initialFormData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPoll();
    }
  }, [slug]);

  // Handle form input changes
  const handleInputChange = (questionId: string, type: string, value: any) => {
    setFormData(prev => {
      const updatedData = { ...prev };
      
      switch (type) {
        case 'single':
          updatedData[questionId] = {
            ...updatedData[questionId],
            selectedOptions: [value]
          };
          break;
        
        case 'multiple':
          const currentOptions = updatedData[questionId].selectedOptions || [];
          if (currentOptions.includes(value)) {
            updatedData[questionId] = {
              ...updatedData[questionId],
              selectedOptions: currentOptions.filter(option => option !== value)
            };
          } else {
            updatedData[questionId] = {
              ...updatedData[questionId],
              selectedOptions: [...currentOptions, value]
            };
          }
          break;
        
        case 'agree':
          updatedData[questionId] = {
            ...updatedData[questionId],
            agreement: value
          };
          break;
        
        case 'rating':
          updatedData[questionId] = {
            ...updatedData[questionId],
            rating: value
          };
          break;
      }
      
      return updatedData;
    });
  };

  // Submit form with proper validation matching backend
  const handleSubmit = async () => {
    if (!allQuestionsAnswered()) {
      setError('Please answer all questions before submitting.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format data exactly as the backend expects
      const answers: Answer[] = Object.entries(formData).map(([questionId, data]) => {
        const answer: Answer = { questionId };
        
        // Only include fields that have values to match backend validation
        if (data.selectedOptions && data.selectedOptions.length > 0) {
          answer.selectedOptions = data.selectedOptions;
        }
        if (data.agreement !== undefined) {
          answer.agreement = data.agreement;
        }
        if (data.rating !== undefined && data.rating > 0) {
          answer.rating = data.rating;
        }
        
        return answer;
      });
      
      const response = await fetch(`/api/dataPoll?slug=${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit response');
      }
      
      const result = await response.json();
      console.log('Response submitted successfully:', result);
      
      setSubmitSuccess(true);
      
      // Redirect to thank you page after a short delay
      setTimeout(() => {
        router.push(`/thankyou`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation check matching backend requirements
  const isQuestionAnswered = (question: Question) => {
    const data = formData[question._id];
    if (!data) return false;
    
    switch (question.type) {
      case 'single':
        return data.selectedOptions && data.selectedOptions.length === 1;
      case 'multiple':
        return data.selectedOptions && data.selectedOptions.length > 0;
      case 'agree':
        return data.agreement !== undefined;
      case 'rating':
        return data.rating !== undefined && data.rating > 0 && data.rating <= (question.ratingScale || 5);
      default:
        return false;
    }
  };

  const allQuestionsAnswered = () => {
    if (!poll) return false;
    return poll.questions.every(q => isQuestionAnswered(q));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-4 flex items-center justify-center animate-pulse">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div className="text-gray-400 text-lg">Loading your poll...</div>
        </div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => router.back()}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft size={18} className="inline mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!poll) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-xl">Poll not found</div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-800 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
          <p className="text-gray-300 mb-2">Your response has been recorded successfully.</p>
          <p className="text-sm text-gray-500 mb-6">Total responses: {poll.responseCount + 1}</p>
          <div className="flex items-center justify-center text-orange-500">
            <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full mr-2"></div>
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-3 flex items-center justify-center">
                <BarChart3 size={16} className="text-white" />
              </div>
              <div className="text-xl font-bold">
                <span className="text-orange-500">True</span>
                <span className="text-white">Feedback</span>
              </div>
            </div>
            {poll.organization && (
              <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
                <span className="text-orange-400 font-medium">{poll.organization.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Branding */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                FastForwardPolls
              </span>
            </div>
            <p className="text-gray-400 text-sm">by TrueFeedback</p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-800/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-red-500 mr-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <div className="text-red-400 font-medium">Error</div>
                  <div className="text-red-300/80 text-sm">{error}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Poll container */}
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            {/* Poll header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 border-b border-gray-700">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3">{poll.title}</h1>
                {poll.description && (
                  <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">{poll.description}</p>
                )}
                <div className="mt-6 inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-gray-400">{poll.responseCount} responses collected</span>
                </div>
              </div>
            </div>
            
            {/* Poll form */}
            <div className="p-8">
              <div className="space-y-8">
                {poll.questions.map((question, qIndex) => (
                  <div 
                    key={question._id} 
                    className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full mr-3">
                            Q{qIndex + 1}
                          </span>
                          <span className="text-red-400">*</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 leading-relaxed">
                          {question.questionText}
                        </h3>
                        <div className="text-sm text-gray-400">
                          {question.type === 'single' && 'Select one option'}
                          {question.type === 'multiple' && 'Select multiple options'}
                          {question.type === 'agree' && 'Choose agree or disagree'}
                          {question.type === 'rating' && `Rate from 1 to ${question.ratingScale || 5}`}
                        </div>
                      </div>
                      <div className="ml-4">
                        {isQuestionAnswered(question) ? (
                          <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                          <Circle size={20} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {/* Question content based on type */}
                    <div className="space-y-3">
                      {question.type === 'single' && question.options && (
                        <div className="space-y-3">
                          {question.options.map((option) => (
                            <label 
                              key={option} 
                              className="flex items-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200 group"
                            >
                              <input
                                type="radio"
                                name={question._id}
                                className="sr-only"
                                checked={formData[question._id]?.selectedOptions?.includes(option) || false}
                                onChange={() => handleInputChange(question._id, 'single', option)}
                              />
                              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                                formData[question._id]?.selectedOptions?.includes(option)
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-gray-500 group-hover:border-gray-400'
                              }`}>
                                {formData[question._id]?.selectedOptions?.includes(option) && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-gray-300 group-hover:text-white transition-colors">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'multiple' && question.options && (
                        <div className="space-y-3">
                          {question.options.map((option) => (
                            <label 
                              key={option} 
                              className="flex items-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200 group"
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={formData[question._id]?.selectedOptions?.includes(option) || false}
                                onChange={() => handleInputChange(question._id, 'multiple', option)}
                              />
                              <div className={`w-5 h-5 rounded border-2 mr-4 flex items-center justify-center transition-all ${
                                formData[question._id]?.selectedOptions?.includes(option)
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-gray-500 group-hover:border-gray-400'
                              }`}>
                                {formData[question._id]?.selectedOptions?.includes(option) && (
                                  <CheckCircle2 size={12} className="text-white" />
                                )}
                              </div>
                              <span className="text-gray-300 group-hover:text-white transition-colors">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'agree' && (
                        <div className="flex space-x-4">
                          {[
                            { value: true, label: 'Agree', color: 'green' },
                            { value: false, label: 'Disagree', color: 'red' }
                          ].map(({ value, label, color }) => (
                            <label 
                              key={label}
                              className="flex-1 flex items-center justify-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200 group"
                            >
                              <input
                                type="radio"
                                name={question._id}
                                className="sr-only"
                                checked={formData[question._id]?.agreement === value}
                                onChange={() => handleInputChange(question._id, 'agree', value)}
                              />
                              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                                formData[question._id]?.agreement === value
                                  ? `border-${color}-500 bg-${color}-500`
                                  : 'border-gray-500 group-hover:border-gray-400'
                              }`}>
                                {formData[question._id]?.agreement === value && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-gray-300 group-hover:text-white transition-colors font-medium">{label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'rating' && (
                        <div className="text-center">
                          <div className="flex justify-center space-x-3 mb-4">
                            {Array.from({ length: question.ratingScale || 5 }, (_, i) => i + 1).map((num) => (
                              <button
                                key={num}
                                type="button"
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-200 transform hover:scale-110 ${
                                  formData[question._id]?.rating === num
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                                }`}
                                onClick={() => handleInputChange(question._id, 'rating', num)}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Lowest</span>
                            <span>Highest</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress indicator */}
              <div className="mt-8 mb-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{poll.questions.filter(q => isQuestionAnswered(q)).length} of {poll.questions.length} completed</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(poll.questions.filter(q => isQuestionAnswered(q)).length / poll.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Submit button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !allQuestionsAnswered()}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                    allQuestionsAnswered() && !isSubmitting
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:scale-105 shadow-lg shadow-orange-500/25'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Response'
                  )}
                </button>
                
                {!allQuestionsAnswered() && (
                  <p className="mt-4 text-sm text-gray-500">
                    Please answer all {poll.questions.length} questions to submit
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-3">Create Your Own Polls</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Join thousands of organizations using FastForwardPolls to collect feedback at lightning speed.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-orange-500/25"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-2 flex items-center justify-center">
                <BarChart3 size={12} className="text-white" />
              </div>
              <span className="text-gray-400 text-sm">
                Powered by <span className="text-orange-500 font-medium">True</span><span className="text-white font-medium">Feedback</span>
              </span>
            </div>
            <div className="text-gray-500 text-sm mb-4">
              Build by <span className="text-white font-medium">Devashish</span>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <a 
                href="https://x.com/Devashish6363" 
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group"
              >
                <Twitter size={16} className="text-gray-400 group-hover:text-blue-400" />
              </a>
              <a 
                href="https://www.linkedin.com/in/devashish-mishra-436891254/" 
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group"
              >
                <Linkedin size={16} className="text-gray-400 group-hover:text-blue-500" />
              </a>
              <a 
                href="https://www.instagram.com/devashish_6363/" 
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group"
              >
                <Instagram size={16} className="text-gray-400 group-hover:text-pink-500" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}