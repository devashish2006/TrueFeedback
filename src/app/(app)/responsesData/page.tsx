'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Users, BarChart3, Calendar, Eye, Filter, Search, ChevronDown, RefreshCw } from 'lucide-react';

interface Question {
  _id: string;
  questionText: string;
  type: 'single' | 'multiple' | 'agree' | 'rating';
  options?: string[];
  ratingScale?: number;
}

interface Answer {
  questionId: string;
  questionText: string;
  questionType: string;
  answer: {
    selectedOptions?: string[];
    agreement?: boolean;
    rating?: number;
  };
  displayValue: string;
}

interface Response {
  responseId: string;
  responseNumber: number;
  submittedAt: string;
  answers: Answer[];
  totalAnswers: number;
}

interface Statistics {
  [questionId: string]: {
    questionId: string;
    questionText: string;
    questionType: string;
    totalResponses: number;
    data: { [key: string]: number };
    averageRating?: {
      sum: number;
      count: number;
      average: number;
    };
  };
}

interface PollData {
  poll: {
    _id: string;
    title: string;
    description?: string;
    organization: {
      name: string;
      username: string;
    };
    createdAt: string;
    slug: string;
    totalQuestions: number;
    totalResponses: number;
  };
  questions: Question[];
  responses: Response[];
  statistics: Statistics;
}

export default function PollResponsesDashboard({ pollId }: { pollId: string }) {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'analytics'>('overview');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetchPollResponses();
  }, [pollId]);

  const fetchPollResponses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/responsesData`);
      if (!response.ok) {
        throw new Error('Failed to fetch poll responses');
      }
      const data = await response.json();
      setPollData(data);
    } catch (error) {
      console.error('Error fetching poll responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`/api/polls/${pollId}/responses/csv`);
      if (!response.ok) throw new Error('Failed to export CSV');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poll-responses-${pollData?.poll.slug}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredResponses = () => {
    if (!pollData) return [];
    
    let filtered = pollData.responses;
    
    if (searchTerm) {
      filtered = filtered.filter(response =>
        response.answers.some(answer =>
          answer.displayValue.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (selectedQuestion !== 'all') {
      filtered = filtered.filter(response =>
        response.answers.some(answer => answer.questionId === selectedQuestion)
      );
    }
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      return sortBy === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  };

  const StatCard = ({ title, value, icon: Icon, color = 'orange' }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
  }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-900`}>
          <Icon size={20} className={`text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const QuestionStats = ({ questionId, stats }: { questionId: string; stats: any }) => {
    const question = pollData?.questions.find(q => q._id === questionId);
    if (!question) return null;

    const renderChart = () => {
      const data = Object.entries(stats.data);
      const maxValue = Math.max(...data.map(([, count]) => count as number));

      return (
        <div className="space-y-3">
          {data.map(([option, count]) => (
            <div key={option} className="flex items-center">
              <div className="w-32 text-sm text-gray-300 truncate">{option}</div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((count as number) / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-white font-medium w-8 text-right">{count}</div>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white">{question.questionText}</h3>
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
            {question.type}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            Total Responses: <span className="text-white font-medium">{stats.totalResponses}</span>
          </p>
          {stats.averageRating && (
            <p className="text-sm text-gray-400 mt-1">
              Average Rating: <span className="text-white font-medium">
                {stats.averageRating.average.toFixed(1)}/{question.ratingScale || 5}
              </span>
            </p>
          )}
        </div>
        
        {renderChart()}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading poll responses...</p>
        </div>
      </div>
    );
  }

  if (!pollData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Poll not found or no access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <div className="w-8 h-8 rounded-full bg-orange-500 mr-2"></div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-orange-500">True</span>Feedback
              </h1>
            </div>
            <div className="text-gray-400 font-light">
              <span className="text-sm">FastForwardPolls</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportCSV}
              className="bg-orange-600 hover:bg-orange-500 text-white py-2 px-4 rounded-lg flex items-center font-medium transition-all"
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </button>
            <div className="rounded-full w-8 h-8 bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-semibold">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="container mx-auto">
          <div className="flex items-center py-4">
            <button className="text-gray-400 hover:text-white flex items-center mr-6">
              <ArrowLeft size={20} className="mr-2" />
              Back to Polls
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{pollData.poll.title}</h2>
              <p className="text-gray-400 text-sm">{pollData.poll.organization.name}</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'responses', label: 'Responses' },
              { id: 'analytics', label: 'Analytics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Responses" value={pollData.poll.totalResponses} icon={Users} />
              <StatCard title="Questions" value={pollData.poll.totalQuestions} icon={BarChart3} />
              <StatCard title="Created" value={formatDate(pollData.poll.createdAt).split(',')[0]} icon={Calendar} />
              <StatCard title="Response Rate" value="N/A" icon={Eye} />
            </div>

            {/* Poll Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Poll Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Poll Title</p>
                  <p className="text-white font-medium">{pollData.poll.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Organization</p>
                  <p className="text-white font-medium">{pollData.poll.organization.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Created Date</p>
                  <p className="text-white font-medium">{formatDate(pollData.poll.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Poll Slug</p>
                  <p className="text-white font-medium">{pollData.poll.slug}</p>
                </div>
              </div>
              {pollData.poll.description && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{pollData.poll.description}</p>
                </div>
              )}
            </div>

            {/* Questions Preview */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Questions ({pollData.questions.length})</h3>
              <div className="space-y-4">
                {pollData.questions.map((question, index) => (
                  <div key={question._id} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{question.questionText}</p>
                      <div className="flex items-center mt-2">
                        <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                          {question.type}
                        </span>
                        {question.options && (
                          <span className="ml-2 text-gray-400 text-sm">
                            {question.options.length} options
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search responses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-700 text-white w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Questions</option>
                  {pollData.questions.map(q => (
                    <option key={q._id} value={q._id}>{q.questionText}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <button
                  onClick={fetchPollResponses}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center transition-all"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Responses List */}
            <div className="space-y-4">
              {getFilteredResponses().length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-gray-400">No responses found</p>
                </div>
              ) : (
                getFilteredResponses().map(response => (
                  <div key={response.responseId} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Response #{response.responseNumber}
                      </h3>
                      <span className="text-gray-400 text-sm">
                        {formatDate(response.submittedAt)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {response.answers.map(answer => (
                        <div key={answer.questionId} className="flex flex-col space-y-2">
                          <p className="text-gray-300 font-medium">{answer.questionText}</p>
                          <div className="bg-gray-700 rounded-lg p-3">
                            <span className="text-white">{answer.displayValue}</span>
                            <span className="ml-2 px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                              {answer.questionType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Response Analytics</h3>
              <p className="text-gray-400">
                Detailed statistics for each question in your poll
              </p>
            </div>
            
            <div className="space-y-6">
              {Object.entries(pollData.statistics).map(([questionId, stats]) => (
                <QuestionStats key={questionId} questionId={questionId} stats={stats} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}