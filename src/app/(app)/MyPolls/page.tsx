'use client'
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, RefreshCw, Filter, Search, ChevronRight, ChevronLeft, BarChart3, Users, Calendar, TrendingUp, Eye, Copy, Download, PieChart, LineChart, Activity } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


interface Answer {
  questionId: string;
  questionText: string;
  questionType: string;
  selectedOptions?: string[];
  agreement?: boolean;
  rating?: number;
}

interface Response {
  id: number;
  submittedAt: string;
  answers: Answer[];
}

interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  type: string;
  totalResponses: number;
  optionCounts?: Record<string, number>;
  agreementCounts?: { agree: number; disagree: number };
  ratingStats?: {
    average: number;
    min: number;
    max: number;
    distribution: Record<string, number>;
  };
}

interface Analytics {
  totalResponses: number;
  responsesByDate: Record<string, number>;
  questionAnalytics: QuestionAnalytics[];
}

interface Poll {
  _id: string;
  title: string;
  organization: { 
    _id: string;
    name: string;
  };
  createdAt: string;
  responsesCount: number;
  status: 'active' | 'inactive';
  url: string;
  slug: string;
  responses: Response[];
  analytics: Analytics;
}



// Mock data for demonstration
const mockPolls: Poll[] = [
  {
    _id: '1',
    title: 'Customer Satisfaction Survey 2024',
    organization: { _id: 'org1', name: 'Tech Corp' },
    createdAt: '2024-01-15T10:00:00Z',
    responsesCount: 245,
    status: 'active',
    url: 'https://truefeedback.com/poll/customer-satisfaction-2024',
    slug: 'customer-satisfaction-2024',
    responses: [
      {
        id: 1,
        submittedAt: '2024-01-20T14:30:00Z',
        answers: [
          {
            questionId: 'q1',
            questionText: 'How satisfied are you with our service?',
            questionType: 'rating',
            rating: 4
          },
          {
            questionId: 'q2',
            questionText: 'Which features do you use most?',
            questionType: 'multiple',
            selectedOptions: ['Dashboard', 'Analytics']
          }
        ]
      },
      {
        id: 2,
        submittedAt: '2024-01-21T09:15:00Z',
        answers: [
          {
            questionId: 'q1',
            questionText: 'How satisfied are you with our service?',
            questionType: 'rating',
            rating: 5
          },
          {
            questionId: 'q2',
            questionText: 'Which features do you use most?',
            questionType: 'multiple',
            selectedOptions: ['Reports', 'Analytics']
          }
        ]
      }
    ],
    analytics: {
      totalResponses: 245,
      responsesByDate: {
        '2024-01-15': 12,
        '2024-01-16': 23,
        '2024-01-17': 31,
        '2024-01-18': 18,
        '2024-01-19': 25,
        '2024-01-20': 34,
        '2024-01-21': 28,
        '2024-01-22': 42,
        '2024-01-23': 32
      },
      questionAnalytics: [
        {
          questionId: 'q1',
          questionText: 'How satisfied are you with our service?',
          type: 'rating',
          totalResponses: 245,
          ratingStats: {
            average: 4.2,
            min: 1,
            max: 5,
            distribution: { '1': 8, '2': 15, '3': 42, '4': 98, '5': 82 }
          }
        },
        {
          questionId: 'q2',
          questionText: 'Which features do you use most?',
          type: 'multiple',
          totalResponses: 245,
          optionCounts: {
            'Dashboard': 156,
            'Analytics': 134,
            'Reports': 98,
            'Settings': 67,
            'API': 34
          }
        },
        {
          questionId: 'q3',
          questionText: 'Would you recommend our service?',
          type: 'agree',
          totalResponses: 245,
          agreementCounts: { agree: 201, disagree: 44 }
        }
      ]
    }
  }
];



const COLORS = ['#f97316', '#ea580c', '#dc2626', '#7c3aed', '#2563eb', '#059669', '#ca8a04'];

export default function PollDashboard() {
  const { data: session } = useSession();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'analytics'>('overview');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchPolls();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-gray-400">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  const router = useRouter();

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/myPolls');
      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setError('Failed to load polls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/polls?pollId=${deleteId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete poll');
      }
      
      setPolls(polls.filter(poll => poll._id !== deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      
      if (selectedPoll?._id === deleteId) {
        setSelectedPoll(null);
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      setError('Failed to delete poll. Please try again.');
    }
  };

  const exportToCSV = (poll: Poll) => {
    setExportLoading(true);
    
    try {
      const csvContent = generateCSVContent(poll);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${poll.title.replace(/\s+/g, '_')}_responses.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const exportToExcel = (poll: Poll) => {
    setExportLoading(true);
    
    try {
      const data = generateExcelData(poll);
      // This would normally use a library like xlsx for proper Excel export
      // For now, we'll create a more structured CSV that Excel can import nicely
      const csvContent = generateStructuredCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${poll.title.replace(/\s+/g, '_')}_detailed_report.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const generateCSVContent = (poll: Poll) => {
    const headers = ['Response ID', 'Submitted At'];
    const questions = poll.analytics?.questionAnalytics || [];
    
    questions.forEach(q => {
      headers.push(q.questionText);
    });

    let csvContent = headers.join(',') + '\n';

    poll.responses?.forEach(response => {
      const row = [response.id, new Date(response.submittedAt).toLocaleString()];
      
      questions.forEach(question => {
        const answer = response.answers.find(a => a.questionId === question.questionId);
        if (answer) {
          if (answer.selectedOptions) {
            row.push(`"${answer.selectedOptions.join('; ')}"`);;
          } else if (answer.agreement !== undefined) {
            row.push(answer.agreement ? 'Agree' : 'Disagree');
          } else if (answer.rating) {
            row.push(answer.rating.toString());
          } else {
            row.push('');
          }
        } else {
          row.push('');
        }
      });
      
      csvContent += row.join(',') + '\n';
    });

    return csvContent;
  };

  const generateExcelData = (poll: Poll) => {
    return {
      summary: {
        title: poll.title,
        totalResponses: poll.responsesCount,
        status: poll.status,
        createdAt: poll.createdAt,
        organization: poll.organization.name
      },
      responses: poll.responses || [],
      analytics: poll.analytics?.questionAnalytics || []
    };
  };

  const generateStructuredCSV = (data: any) => {
    let content = '';
    
    // Poll Summary
    content += 'POLL SUMMARY\n';
    content += `Title,${data.summary.title}\n`;
    content += `Organization,${data.summary.organization}\n`;
    content += `Total Responses,${data.summary.totalResponses}\n`;
    content += `Status,${data.summary.status}\n`;
    content += `Created At,${new Date(data.summary.createdAt).toLocaleString()}\n`;
    content += '\n';
    
    // Analytics Summary
    content += 'ANALYTICS SUMMARY\n';
    content += 'Question,Type,Total Responses,Additional Data\n';
    data.analytics.forEach((q: QuestionAnalytics) => {
      let additionalData = '';
      if (q.ratingStats) {
        additionalData = `Average: ${q.ratingStats.average}`;
      } else if (q.agreementCounts) {
        additionalData = `Agree: ${q.agreementCounts.agree}, Disagree: ${q.agreementCounts.disagree}`;
      } else if (q.optionCounts) {
        additionalData = Object.entries(q.optionCounts).map(([option, count]) => `${option}: ${count}`).join('; ');
      }
      content += `"${q.questionText}",${q.type},${q.totalResponses},"${additionalData}"\n`;
    });
    content += '\n';
    
    // Individual Responses
    content += 'INDIVIDUAL RESPONSES\n';
    const headers = ['Response ID', 'Submitted At'];
    data.analytics.forEach((q: QuestionAnalytics) => {
      headers.push(`"${q.questionText}"`);
    });
    content += headers.join(',') + '\n';
    
    data.responses.forEach((response: Response) => {
      const row = [response.id, new Date(response.submittedAt).toLocaleString()];
      data.analytics.forEach((question: QuestionAnalytics) => {
        const answer = response.answers.find(a => a.questionId === question.questionId);
        if (answer) {
          if (answer.selectedOptions) {
            row.push(`"${answer.selectedOptions.join('; ')}"`);
          } else if (answer.agreement !== undefined) {
            row.push(answer.agreement ? 'Agree' : 'Disagree');
          } else if (answer.rating) {
            row.push(answer.rating.toString());
          } else {
            row.push('');
          }
        } else {
          row.push('');
        }
      });
      content += row.join(',') + '\n';
    });
    
    return content;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const showDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const PollCard = ({ poll }: { poll: Poll }) => (
    <div 
      className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4 hover:bg-gray-700 cursor-pointer transition-all transform hover:scale-[1.02]"
      onClick={() => {
        setSelectedPoll(poll);
        setActiveTab('overview');
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{poll.title}</h3>
          <p className="text-gray-400 text-sm mt-1">
            Organization: {poll.organization.name}
          </p>
          <div className="flex space-x-2 mt-2">
            <span className={`px-2 py-1 rounded text-xs ${poll.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
              {poll.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
              {poll.responsesCount || 0} responses
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-gray-400 text-sm">{formatShortDate(poll.createdAt)}</p>
          <button 
            className="mt-2 p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-red-400 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              showDeleteModal(poll._id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const PollOverview = ({ poll }: { poll: Poll }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-700/30 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="text-orange-400 mr-2" size={20} />
            <p className="text-gray-400 text-sm">Total Responses</p>
          </div>
          <p className="text-white font-semibold text-2xl mt-1">{poll.responsesCount || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 p-4 rounded-lg">
          <div className="flex items-center">
            <Calendar className="text-blue-400 mr-2" size={20} />
            <p className="text-gray-400 text-sm">Created On</p>
          </div>
          <p className="text-white font-semibold">{formatShortDate(poll.createdAt)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-700/30 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="text-green-400 mr-2" size={20} />
            <p className="text-gray-400 text-sm">Status</p>
          </div>
          <p className={`font-semibold ${poll.status === 'active' ? 'text-green-300' : 'text-gray-300'}`}>
            {poll.status === 'active' ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 p-4 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="text-purple-400 mr-2" size={20} />
            <p className="text-gray-400 text-sm">Questions</p>
          </div>
          <p className="text-white font-semibold text-2xl mt-1">{poll.analytics?.questionAnalytics?.length || 0}</p>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-4 rounded-lg">
        <p className="text-gray-400 text-sm mb-2">Poll URL</p>
        <div className="flex items-center bg-gray-900/50 p-2 rounded-lg border border-gray-700">
          <input 
            type="text" 
            value={poll.url} 
            readOnly 
            className="bg-transparent text-white flex-1 outline-none text-sm"
          />
          <button 
            className="text-orange-400 hover:text-orange-300 ml-2 p-1 rounded hover:bg-gray-700 transition-all"
            onClick={() => copyToClipboard(poll.url)}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <button 
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center"
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} className="mr-2" />
          View Analytics
        </button>
        <button 
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center"
          onClick={() => setActiveTab('responses')}
        >
          <Users size={16} className="mr-2" />
          View Responses
        </button>
        <button 
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center"
          onClick={() => exportToCSV(poll)}
          disabled={exportLoading}
        >
          <Download size={16} className="mr-2" />
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </button>
        <button 
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center"
          onClick={() => exportToExcel(poll)}
          disabled={exportLoading}
        >
          <Download size={16} className="mr-2" />
          {exportLoading ? 'Exporting...' : 'Export Report'}
        </button>
        <button 
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center"
          onClick={() => showDeleteModal(poll._id)}
        >
          <Trash2 size={16} className="mr-2" />
          Delete Poll
        </button>
      </div>
    </div>
  );

  const PollResponses = ({ poll }: { poll: Poll }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Individual Responses</h3>
        <div className="flex gap-2">
          <button 
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center text-sm"
            onClick={() => exportToCSV(poll)}
            disabled={exportLoading}
          >
            <Download size={14} className="mr-2" />
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>
      
      {poll.responses && poll.responses.length > 0 ? (
        poll.responses.map((response) => (
          <div key={response.id} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-all">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-medium">Response #{response.id}</h4>
              <span className="text-gray-400 text-sm">{formatDate(response.submittedAt)}</span>
            </div>
            <div className="space-y-3">
              {response.answers.map((answer, index) => (
                <div key={index} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <p className="text-gray-300 font-medium mb-2">{answer.questionText}</p>
                  <div className="text-sm">
                    {answer.questionType === 'single' || answer.questionType === 'multiple' ? (
                      <div className="flex flex-wrap gap-1">
                        {answer.selectedOptions?.map((option, i) => (
                          <span key={i} className="bg-orange-900/70 text-orange-200 px-2 py-1 rounded text-xs border border-orange-700">
                            {option}
                          </span>
                        ))}
                      </div>
                    ) : answer.questionType === 'agree' ? (
                      <span className={`px-2 py-1 rounded text-xs border ${answer.agreement ? 'bg-green-900/70 text-green-200 border-green-700' : 'bg-red-900/70 text-red-200 border-red-700'}`}>
                        {answer.agreement ? 'Agree' : 'Disagree'}
                      </span>
                    ) : answer.questionType === 'rating' ? (
                      <div className="flex items-center">
                        <span className="text-orange-400 font-bold mr-2">{answer.rating}</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={`text-lg ${star <= (answer.rating || 0) ? 'text-orange-400' : 'text-gray-600'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
          <Users className="mx-auto text-gray-500 mb-3" size={48} />
          <p className="text-gray-400">No responses yet</p>
        </div>
      )}
    </div>
  );

  const PollAnalytics = ({ poll }: { poll: Poll }) => {
    const timelineData = Object.entries(poll.analytics?.responsesByDate || {})
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => ({
        date: formatShortDate(date),
        responses: count
      }));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="mr-2" size={20} />
            Analytics Dashboard
          </h3>
          <button 
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center text-sm"
            onClick={() => exportToExcel(poll)}
            disabled={exportLoading}
          >
            <Download size={14} className="mr-2" />
            {exportLoading ? 'Exporting...' : 'Export Full Report'}
          </button>
        </div>

        {/* Response Timeline Chart */}
        {timelineData.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
            <h4 className="text-white font-medium mb-4 flex items-center">
              <LineChart className="mr-2 text-blue-400" size={18} />
              Responses Over Time
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="responses" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorResponses)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Question Analytics */}
        <div className="space-y-6">
          {poll.analytics?.questionAnalytics?.map((question, index) => (
            <div key={question.questionId} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
              <h5 className="text-white font-medium mb-3 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
                  {index + 1}
                </span>
                {question.questionText}
              </h5>
              <div className="text-sm text-gray-400 mb-4">
                {question.totalResponses} responses • {question.type} question
              </div>

              {/* Single/Multiple Choice Analytics with Charts */}
              {question.optionCounts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <div>
                    <h6 className="text-gray-300 font-medium mb-3">Response Distribution</h6>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={Object.entries(question.optionCounts).map(([option, count]) => ({ option, count }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="option" 
                            stroke="#9CA3AF" 
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#fff'
                            }} 
                          />
                          <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Pie Chart */}
                  <div>
                    <h6 className="text-gray-300 font-medium mb-3">Percentage Breakdown</h6>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={Object.entries(question.optionCounts).map(([option, count], i) => ({ 
                              name: option, 
                              value: count,
                              percentage: Math.round((count / question.totalResponses) * 100)
                            }))}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({name, percentage}) => `${name}: ${percentage}%`}
                          >
                            {Object.entries(question.optionCounts).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#fff'
                            }} 
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Agree/Disagree Analytics with Chart */}
              {question.agreementCounts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 p-4 rounded-lg text-center">
                      <div className="text-green-200 font-bold text-2xl">{question.agreementCounts.agree}</div>
                      <div className="text-green-300 text-sm">Agree</div>
                      <div className="text-green-400 text-xs mt-1">
                        {Math.round((question.agreementCounts.agree / question.totalResponses) * 100)}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 p-4 rounded-lg text-center">
                      <div className="text-red-200 font-bold text-2xl">{question.agreementCounts.disagree}</div>
                      <div className="text-red-300 text-sm">Disagree</div>
                      <div className="text-red-400 text-xs mt-1">
                        {Math.round((question.agreementCounts.disagree / question.totalResponses) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-gray-300 font-medium mb-3">Agreement Distribution</h6>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Agree', value: question.agreementCounts.agree, color: '#059669' },
                              { name: 'Disagree', value: question.agreementCounts.disagree, color: '#dc2626' }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                            label={({name, value}) => `${name}: ${value}`}
                          >
                            <Cell fill="#059669" />
                            <Cell fill="#dc2626" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#fff'
                            }} 
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating Analytics with Charts */}
              {question.ratingStats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700/50 p-4 rounded-lg text-center">
                      <div className="text-orange-400 font-bold text-2xl">{question.ratingStats.average.toFixed(1)}</div>
                      <div className="text-gray-400 text-sm">Average Rating</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 p-4 rounded-lg text-center">
                      <div className="text-blue-400 font-bold text-2xl">{question.ratingStats.min}</div>
                      <div className="text-gray-400 text-sm">Minimum</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 p-4 rounded-lg text-center">
                      <div className="text-purple-400 font-bold text-2xl">{question.ratingStats.max}</div>
                      <div className="text-gray-400 text-sm">Maximum</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart for Rating Distribution */}
                    <div>
                      <h6 className="text-gray-300 font-medium mb-3">Rating Distribution</h6>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={[5,4,3,2,1].map(rating => ({
                            rating: `${rating} Star${rating !== 1 ? 's' : ''}`,
                            count: question.ratingStats!.distribution[rating] || 0
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="rating" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                              }} 
                            />
                            <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Horizontal Progress Bars */}
                    <div>
                      <h6 className="text-gray-300 font-medium mb-3">Detailed Breakdown</h6>
                      <div className="space-y-3">
                        {[5,4,3,2,1].map(rating => {
                          const count = question.ratingStats!.distribution[rating] || 0;
                          const percentage = question.totalResponses > 0 ? (count / question.totalResponses) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center">
                              <span className="text-gray-300 w-12 text-sm">{rating}★</span>
                              <div className="flex-1 bg-gray-800 rounded-full h-3 mx-3 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-500" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium w-8 text-sm text-right">{count}</span>
                              <span className="text-gray-400 text-xs ml-2 w-12">({percentage.toFixed(1)}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PollDetail = ({ poll }: { poll: Poll }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{poll.title}</h2>
        <button 
          className="text-gray-400 hover:text-white flex items-center transition-all hover:bg-gray-700 px-3 py-2 rounded-lg"
          onClick={() => setSelectedPoll(null)}
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Back to polls</span>
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        {[
          { key: 'overview', label: 'Overview', icon: Eye },
          { key: 'responses', label: `Responses (${poll.responsesCount || 0})`, icon: Users },
          { key: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`pb-2 px-1 font-medium transition-all flex items-center ${
              activeTab === key
                ? 'text-orange-400 border-b-2 border-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab(key as any)}
          >
            <Icon size={16} className="mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <PollOverview poll={poll} />}
      {activeTab === 'responses' && <PollResponses poll={poll} />}
      {activeTab === 'analytics' && <PollAnalytics poll={poll} />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 px-6 py-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-2 flex items-center justify-center">
                <BarChart3 size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-orange-500">True</span>Feedback
              </h1>
            </div>
            <div className="text-gray-400 font-light">
              <span className="text-sm">{session.user?.organization || 'My Organization'}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="rounded-full w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center mr-2">
              <span className="text-sm font-semibold">
                {session.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium">{session.user?.name || 'User'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-6">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!selectedPoll ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Polls</h2>
              <button 
              onClick={() => router.push('/fastForward')}
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-2 px-4 rounded-lg flex items-center font-medium transition-all transform hover:scale-105">
                <Plus size={18} className="mr-2" />
                Create New Poll
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search polls" 
                      className="bg-gray-900/50 border border-gray-700 text-white w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-700/50 border border-gray-600 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center transition-all">
                    <Filter size={16} className="mr-2 text-gray-400" />
                    <span>Filter</span>
                  </button>
                  <button 
                    className="bg-gray-700/50 border border-gray-600 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center transition-all"
                    onClick={fetchPolls}
                  >
                    <RefreshCw size={16} className="mr-2 text-gray-400" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading polls...</p>
              </div>
            ) : polls.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={32} className="text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No polls yet</h3>
                <p className="text-gray-400 mb-6">Create your first poll to get started</p>
                <button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-2 px-6 rounded-lg font-medium transition-all transform hover:scale-105">
                  Create Poll
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {polls.map(poll => (
                  <PollCard key={poll._id} poll={poll} />
                ))}
              </div>
            )}
          </>
        ) : (
          <PollDetail poll={selectedPoll} />
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Poll</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this poll? This action cannot be undone and all responses will be permanently lost.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all"
                onClick={handleDeletePoll}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}