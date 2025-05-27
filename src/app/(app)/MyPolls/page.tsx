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
  const [organization, setOrganization] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

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
    setPolls(data.polls || []);
    setOrganization(data.organization);
  } catch (error) {
    console.error('Error fetching polls:', error);
    setError('Failed to load polls. Please try again.');
  } finally {
    setLoading(false);
  }
};

// Replace the exportToPDF function with these improvements:

const exportToPDF = async (poll: Poll) => {
  setPdfLoading(true);
  
  try {
    // Dynamic import to reduce bundle size
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    const { default: Chart } = await import('chart.js/auto');
    
    // Initialize PDF with proper settings for better font rendering
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2
    });

    // Set high-quality font rendering
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40); // Darker text for better readability

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;
    
    // Helper function to add diagonal watermark on any page
    const addDiagonalWatermark = () => {
      pdf.saveGraphicsState();
      pdf.setGState(pdf.GState({ opacity: 0.1 })); // Very light opacity
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      
      // Calculate center position for diagonal text
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      
      // Add diagonal watermark text
      pdf.text('SYSTEM GENERATED', centerX, centerY, {
        angle: 45,
        align: 'center'
      });
      
      pdf.restoreGraphicsState();
    };
    
    // Helper function to add new page if needed
    const checkPageBreak = (height: number) => {
      if (currentY + height > pageHeight - margin) {
        pdf.addPage();
        addDiagonalWatermark(); // Add watermark to new page
        currentY = margin;
        return true;
      }
      return false;
    };
    
    // Improved header function with better typography
    const addHeader = () => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.setTextColor(247, 115, 22); // Orange
      pdf.text('True', margin, currentY);
      
      pdf.setTextColor(40, 40, 40); // Dark gray for better contrast
      pdf.text('Feedback', margin + 25, currentY);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Professional Poll Analytics Report', margin, currentY + 8);
      
      // Clean line separator
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY + 12, pageWidth - margin, currentY + 12);
      
      currentY += 20;
    };
    
    // Improved footer function
    const addFooter = (pageNum: number, totalPages: number) => {
      const footerY = pageHeight - 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(120, 120, 120);
      
      // Left side - generation date
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, margin, footerY);
      
      // Center - organization info
      pdf.text('TrueFeedback Analytics System', pageWidth / 2, footerY, { align: 'center' });
      
      // Right side - page numbers with better formatting
      pdf.text(`${pageNum} / ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
    };
    
    // Add first page header and watermark
    addHeader();
    addDiagonalWatermark();
    
    // Improved poll title with better typography
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(40, 40, 40);
    const titleLines = pdf.splitTextToSize(poll.title, pageWidth - margin * 2);
    pdf.text(titleLines, margin, currentY);
    currentY += titleLines.length * 8 + 15;
    
    // Enhanced metadata box with cleaner design
    pdf.setFillColor(248, 249, 250);
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, currentY, pageWidth - margin * 2, 40, 2, 2, 'FD');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    
    const metadataY = currentY + 8;
    pdf.text(`Organization: ${poll.organization.name}`, margin + 8, metadataY);
    pdf.text(`Created: ${new Date(poll.createdAt).toLocaleDateString('en-US')}`, margin + 8, metadataY + 6);
    pdf.text(`Status: ${poll.status.toUpperCase()}`, margin + 8, metadataY + 12);
    pdf.text(`Total Responses: ${poll.responsesCount}`, margin + 8, metadataY + 18);
    pdf.text(`Poll URL: ${poll.url || 'N/A'}`, margin + 8, metadataY + 24);
    pdf.text(`Report ID: ${Date.now()}`, margin + 8, metadataY + 30);
    
    currentY += 50;
    
    // Improved section headers
    const addSectionHeader = (title: string) => {
      checkPageBreak(25);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(247, 115, 22); // Orange theme color
      pdf.text(title, margin, currentY);
      currentY += 12;
    };
    
    // Executive Summary with better formatting
    addSectionHeader('Executive Summary');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    
    const summaryText = [
      `This comprehensive report analyzes the "${poll.title}" survey responses.`,
      `Data collected: ${poll.responsesCount} total responses across ${poll.analytics?.questionAnalytics?.length || 0} questions.`,
      `Collection period: ${new Date(poll.createdAt).toLocaleDateString('en-US')} to ${new Date().toLocaleDateString('en-US')}`,
      `Current status: ${poll.status.toUpperCase()}`,
      `Report generated: ${new Date().toLocaleString('en-US')}`,
      ''
    ];
    
    summaryText.forEach(line => {
      if (line) {
        checkPageBreak(8);
        const splitText = pdf.splitTextToSize(line, pageWidth - margin * 2);
        pdf.text(splitText, margin, currentY);
        currentY += splitText.length * 6;
      } else {
        currentY += 6;
      }
    });
    
    // Enhanced chart creation with better fonts
    const createChart = async (type: string, data: any, options = {}) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1000; // Higher resolution
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      const chart = new Chart(ctx, {
        type,
        data,
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              display: type === 'pie',
              position: 'bottom',
              labels: {
                font: {
                  family: 'Arial',
                  size: 14,
                  weight: 'normal'
                },
                color: '#333333',
                padding: 15
              }
            },
            title: { 
              display: true,
              text: data.datasets[0].label || '',
              font: {
                family: 'Arial',
                size: 16,
                weight: 'bold'
              },
              color: '#333333',
              padding: 20
            }
          },
          scales: type !== 'pie' ? {
            y: { 
              beginAtZero: true,
              ticks: {
                font: {
                  family: 'Arial',
                  size: 12
                },
                color: '#666666'
              },
              grid: {
                color: '#e0e0e0'
              }
            },
            x: { 
              display: true,
              ticks: {
                font: {
                  family: 'Arial',
                  size: 12
                },
                color: '#666666'
              },
              grid: {
                color: '#e0e0e0'
              }
            }
          } : {},
          ...options
        }
      });
      
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          const imageData = canvas.toDataURL('image/png', 0.9);
          chart.destroy();
          resolve(imageData);
        }, 400);
      });
    };

    // Response Timeline Chart with improved styling
    if (poll.analytics?.responsesByDate && Object.keys(poll.analytics.responsesByDate).length > 0) {
      addSectionHeader('Response Timeline Analysis');
      
      const timelineData = Object.entries(poll.analytics.responsesByDate)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
      
      const chartData = {
        labels: timelineData.map(([date]) => new Date(date).toLocaleDateString('en-US')),
        datasets: [{
          label: 'Daily Response Count',
          data: timelineData.map(([, count]) => count),
          borderColor: '#f97316',
          backgroundColor: '#f9731640',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }]
      };
      
      checkPageBreak(90);
      const chartImage = await createChart('line', chartData);
      pdf.addImage(chartImage, 'PNG', margin, currentY, pageWidth - margin * 2, 75);
      currentY += 85;
      
      // Timeline statistics with better formatting
      const totalDays = timelineData.length;
      const avgDaily = Math.round(poll.responsesCount / totalDays);
      const peakDay = timelineData.reduce((max, [date, count]) => 
        count > max.count ? {date, count} : max, 
        {date: '', count: 0}
      );
      
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Analysis Period: ${totalDays} days • Average: ${avgDaily} responses/day • Peak: ${peakDay.count} responses (${new Date(peakDay.date).toLocaleDateString('en-US')})`, 
        margin, 
        currentY
      );
      currentY += 20;
    }

    // Enhanced question summaries
    if (poll.analytics?.questionAnalytics?.length > 0) {
      addSectionHeader('Detailed Question Analysis');

      for (const question of poll.analytics.questionAnalytics) {
        checkPageBreak(60);
        
        // Question header with better styling
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(40, 40, 40);
        
        const questionText = pdf.splitTextToSize(`Q: ${question.questionText}`, pageWidth - margin * 2);
        pdf.text(questionText, margin, currentY);
        currentY += questionText.length * 6 + 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`Type: ${question.type} • Total Responses: ${question.totalResponses}`, margin, currentY);
        currentY += 12;

        // Enhanced data visualization for different question types
        if (question.optionCounts) {
          const optionEntries = Object.entries(question.optionCounts);
          const maxWidth = pageWidth - margin * 2;
          
          // Clean table header
          pdf.setFillColor(245, 245, 245);
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(margin, currentY, maxWidth, 10, 'FD');
          
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          pdf.text('Response Option', margin + 3, currentY + 7);
          pdf.text('Count (%)', margin + maxWidth * 0.7, currentY + 7);
          currentY += 12;
          
          // Clean table rows
          for (const [option, count] of optionEntries) {
            const percentage = Math.round((count / question.totalResponses) * 100);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(40, 40, 40);
            
            const optionText = pdf.splitTextToSize(option, maxWidth * 0.65);
            pdf.text(optionText, margin + 3, currentY + 6);
            
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${count} (${percentage}%)`, margin + maxWidth * 0.7, currentY + 6);
            
            // Clean progress bar
            const barWidth = (maxWidth * 0.3) * (percentage / 100);
            pdf.setFillColor(249, 115, 22, 0.7);
            pdf.roundedRect(margin + maxWidth * 0.75, currentY + 2, barWidth, 5, 1, 1, 'F');
            
            currentY += Math.max(optionText.length * 5, 8);
          }
          currentY += 10;
        } 
        else if (question.agreementCounts) {
          const agreePercent = Math.round((question.agreementCounts.agree / question.totalResponses) * 100);
          const disagreePercent = Math.round((question.agreementCounts.disagree / question.totalResponses) * 100);
          
          // Create a clean agreement visualization
          pdf.setFillColor(240, 253, 244);
          pdf.setDrawColor(34, 197, 94);
          pdf.roundedRect(margin, currentY, (pageWidth - margin * 2) / 2 - 5, 20, 2, 2, 'FD');
          
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(22, 163, 74);
          pdf.text('AGREE', margin + 5, currentY + 8);
          pdf.text(`${question.agreementCounts.agree} (${agreePercent}%)`, margin + 5, currentY + 15);
          
          pdf.setFillColor(254, 242, 242);
          pdf.setDrawColor(239, 68, 68);
          pdf.roundedRect(margin + (pageWidth - margin * 2) / 2 + 5, currentY, (pageWidth - margin * 2) / 2 - 5, 20, 2, 2, 'FD');
          
          pdf.setTextColor(220, 38, 38);
          pdf.text('DISAGREE', margin + (pageWidth - margin * 2) / 2 + 10, currentY + 8);
          pdf.text(`${question.agreementCounts.disagree} (${disagreePercent}%)`, margin + (pageWidth - margin * 2) / 2 + 10, currentY + 15);
          
          currentY += 30;
        } 
        else if (question.ratingStats) {
          // Enhanced rating display
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.setTextColor(40, 40, 40);
          pdf.text(`Average Rating: ${question.ratingStats.average.toFixed(1)} / 5.0`, margin, currentY);
          currentY += 10;
          
          // Clean rating distribution
          for (let rating = 5; rating >= 1; rating--) {
            const count = question.ratingStats.distribution[rating] || 0;
            const percentage = Math.round((count / question.totalResponses) * 100);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(40, 40, 40);
            pdf.text(`${rating} Star${rating !== 1 ? 's' : ''}:`, margin, currentY);
            pdf.text(`${count} responses (${percentage}%)`, margin + 25, currentY);
            
            // Clean progress bar
            pdf.setFillColor(249, 115, 22, 0.7);
            pdf.roundedRect(margin + 80, currentY - 3, 60 * (percentage / 100), 6, 1, 1, 'F');
            
            currentY += 8;
          }
          currentY += 10;
        }
        
        // Clean section separator
        pdf.setDrawColor(230, 230, 230);
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 15;
      }
    }

    // Add watermark and footer to all pages
    const totalPages = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      if (i > 1) {
        addDiagonalWatermark(); // Ensure all pages have watermark
      }
      addFooter(i, totalPages);
    }
    
    // Clean filename and download
    const cleanTitle = poll.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const fileName = `${cleanTitle}_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    setError('Failed to generate PDF report. Please try again.');
  } finally {
    setPdfLoading(false);
  }
};

  const handleDeletePoll = async () => {
  if (!deleteId) return;
  
  try {
    console.log('Deleting poll with ID:', deleteId);
    
    const response = await fetch(`/api/myPolls?pollId=${deleteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Delete response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Delete error response:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Delete success:', result);
    
    // Check for success flag
    if (result.success) {
      setPolls(polls.filter(poll => poll._id !== deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);

      if (selectedPoll?._id === deleteId) {
        setSelectedPoll(null);
      }

      // Optional: Update organization info if needed
      if (result.organization) {
        setOrganization(result.organization);
      }
      
      // Optional: Show success message
      console.log('Poll deleted successfully:', result.deletedPoll?.title);
    } else {
      throw new Error('Delete operation failed');
    }
    
  } catch (error) {
    console.error('Error deleting poll:', error);
    setError(`Failed to delete poll: ${error.message}`);
    // Don't close the modal on error so user can try again
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
            Organization: {poll.organizationInfo?.name || poll.organization?.name}
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
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center"
            onClick={() => exportToPDF(poll)}
            disabled={pdfLoading}
            >
          <Download size={16} className="mr-2" />
          {pdfLoading ? 'Generating PDF...' : 'Export PDF Report'}
        </button>

        {/* Other buttons remain the same */}
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
              <span className="text-sm">{organization?.name || 'My Organization'}</span>
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