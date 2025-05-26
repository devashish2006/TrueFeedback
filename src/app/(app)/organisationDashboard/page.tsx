'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { 
  RefreshCcw, 
  LogOut, 
  Copy, 
  Bell, 
  PenLine, 
  Download, 
  Camera, 
  X, 
  Check,
  BarChart3,
  MessageSquare,
  Users,
  Shield,
  Settings,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Message } from '@/model/User';
import { ApiResponse } from '../../../../types/ApiResponse';
import { User } from 'next-auth';
import { useToast } from '@/hooks/use-toast';
import { MessageCard } from '@/components/ui/MessageCard';

interface OrganizationData {
  _id: string;
  username: string;
  name: string;
  description: string;
  logoUrl: string;
  createdAt: string;
  __v: number;
}

function PremiumOrganizationDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [org, setOrg] = useState<OrganizationData | null>(null);
  
  // Edit related states
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [isSubmittingDesc, setIsSubmittingDesc] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchOrgDetails = useCallback(async () => {
    try {
      const res = await fetch('/api/getOrganisationDetails');
      const data = await res.json();
      if (res.ok && data.organization) {
        setOrg(data.organization);
        setNewDescription(data.organization.description || '');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch organization details',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching organization details:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/getMessageOrganisation');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchOrgDetails();
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchOrgDetails, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const newValue = !acceptMessages;
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: newValue,
      });
      setValue('acceptMessages', newValue);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  const exportMessagesToCSV = () => {
    if (messages.length === 0) {
      toast({
        title: 'No messages to export',
        description: 'There are no messages available to export.',
        variant: 'default',
      });
      return;
    }
  
    const headers = ['Message', 'Created At'];
    const csvRows = [
      headers,
      ...messages.map(msg => {
        const messageContent = msg.content || msg.text || msg.message || 
                              (typeof msg === 'object' ? JSON.stringify(msg) : String(msg));
        
        return [
          typeof messageContent === 'string' 
            ? messageContent.replace(/"/g, '""') 
            : "No message content",
          msg.createdAt 
            ? new Date(msg.createdAt).toLocaleString() 
            : "Unknown date"
        ];
      })
    ];
    
    const csvContent = csvRows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${org?.name}-messages-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export Successful',
      description: `${messages.length} messages exported to CSV.`,
      variant: 'default',
    });
  };

  const startEditingDescription = () => {
    setIsEditingDesc(true);
    setNewDescription(org?.description || '');
  };

  const cancelEditDescription = () => {
    setIsEditingDesc(false);
  };

  const saveDescription = async () => {
  if (!org) return;
  
  setIsSubmittingDesc(true);
  try {
    const formData = new FormData();
    formData.append('description', newDescription);

    const response = await axios.post('/api/EditOrganisationDetails', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.success) {
      setOrg({...org, description: newDescription});
      toast({
        title: 'Success',
        description: 'Organization description updated successfully',
      });
      setIsEditingDesc(false);
    } else {
      toast({
        title: 'Error',
        description: response.data.message || 'Failed to update description',
        variant: 'destructive',
      });
    }
  } catch (error) {
    console.error('Error updating description:', error);
    toast({
      title: 'Error',
      description: 'Something went wrong while updating description',
      variant: 'destructive',
    });
  } finally {
    setIsSubmittingDesc(false);
  }
};

// Replace the saveImage function with this:
const saveImage = async () => {
  if (!newImageFile || !org) return;
  
  setIsSubmittingImage(true);
  
  const formData = new FormData();
  formData.append('logo', newImageFile); // Changed from 'image' to 'logo'
  
  try {
    const response = await axios.post('/api/EditOrganisationDetails', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.success) {
      setOrg({...org, logoUrl: response.data.organization.logoUrl}); // Updated to get logoUrl from organization object
      toast({
        title: 'Success',
        description: 'Organization logo updated successfully',
      });
      setIsEditingImage(false);
      setNewImageFile(null);
      setNewImagePreview(null);
    } else {
      toast({
        title: 'Error',
        description: response.data.error || 'Failed to update logo', // Changed from 'message' to 'error'
        variant: 'destructive',
      });
    }
  } catch (error) {
    console.error('Error updating logo:', error);
    const errorMessage = error.response?.data?.error || 'Something went wrong while updating logo';
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  } finally {
    setIsSubmittingImage(false);
  }
};

  const startEditingImage = () => {
    setIsEditingImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'The image must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      if (!file.type.match('image.*')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }
      
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setIsEditingImage(true);
    }
  };

  const cancelEditImage = () => {
    setIsEditingImage(false);
    setNewImageFile(null);
    setNewImagePreview(null);
  };


  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navigateToFastForwardPolls = () => {
    window.location.href = '/fastForward';
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <span className="text-orange-400 font-medium text-center">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/org/${org.name}/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Organization unique URL has been copied to clipboard.',
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "orange" }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${color}-400`} />
        </div>
        <div className={`text-2xl sm:text-3xl font-bold text-${color}-400`}>
          {value}
        </div>
      </div>
      <h3 className="text-white font-semibold text-base sm:text-lg mb-1">{title}</h3>
      <p className="text-slate-400 text-xs sm:text-sm">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold">
              <span className="text-orange-400">True</span>
              <span className="text-white">Feedback</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={navigateToFastForwardPolls}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-orange-500/25 text-sm sm:text-base"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">FastForward Polls</span>
              <span className="sm:hidden">Polls</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            Welcome back, <span className="text-orange-400">{username}</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl">Your premium feedback management hub</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatCard
            icon={MessageSquare}
            title="Total Messages"
            value={messages.length}
            subtitle="Anonymous feedback received"
            color="orange"
          />
          <StatCard
            icon={Users}
            title="Status"
            value={acceptMessages ? "ON" : "OFF"}
            subtitle="Message acceptance"
            color={acceptMessages ? "green" : "red"}
          />
          <StatCard
            icon={Shield}
            title="Privacy"
            value="100%"
            subtitle="Completely anonymous"
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Share Profile Card */}
          <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">Share Your Profile</h2>
            </div>
            <p className="text-slate-400 mb-6 text-sm sm:text-base">Share this link to receive anonymous feedback from anyone</p>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all w-full sm:w-auto"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm sm:text-base">Accept Messages</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {acceptMessages ? 'Messages are enabled' : 'Messages are disabled'}
                  </p>
                </div>
                <button
                  onClick={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                    acceptMessages ? 'bg-orange-500' : 'bg-slate-600'
                  } ${isSwitchLoading ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      acceptMessages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Profile Section */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8">Organization Profile</h2>
          
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Organization Image */}
            <div className="flex-shrink-0 self-center lg:self-start">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-600">
                  {(org.logoUrl || newImagePreview) ? (
                    <img
                      src={isEditingImage && newImagePreview ? newImagePreview : org.logoUrl}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold text-white">{org.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                {isEditingImage ? (
                  <div className="absolute -bottom-2 -right-2 flex gap-2">
                    <button
                      onClick={saveImage}
                      disabled={isSubmittingImage || !newImageFile}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      {isSubmittingImage ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-white" />
                      ) : (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={cancelEditImage}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startEditingImage}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center transition-all absolute -bottom-2 -right-2"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Organization Details */}
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center lg:text-left">{org.name}</h3>
              
              {isEditingDesc ? (
                <div className="space-y-4">
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all text-sm sm:text-base"
                    placeholder="Enter organization description"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={saveDescription}
                      disabled={isSubmittingDesc}
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      {isSubmittingDesc ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={cancelEditDescription}
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed pr-8 text-center lg:text-left">
                    {org.description || "No description available"}
                  </p>
                  <button
                    onClick={startEditingDescription}
                    className="absolute top-0 right-0 text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <PenLine className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Organization Messages</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => fetchMessages(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCcw className="w-4 h-4" />
                )}
                Refresh
              </button>
              <button
                onClick={exportMessagesToCSV}
                disabled={messages.length === 0 || isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {messages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No messages yet</h3>
              <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base px-4">
                Share your organization profile link to start receiving anonymous feedback from your audience.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-6 sm:py-8 text-center px-4">
        <p className="text-slate-400 text-sm sm:text-base">
          © 2025 <span className="text-orange-400">True</span><span className="text-white">Feedback</span> • Premium Anonymous Feedback Platform
        </p>
      </footer>
    </div>
  );
}

export default PremiumOrganizationDashboard;