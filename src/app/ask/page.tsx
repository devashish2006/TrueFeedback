'use client';

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Building2, 
  ArrowRight, 
  BarChart3, 
  PieChart, 
  Star, 
  CheckSquare, 
  ListChecks,
  Target,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";

const UserTypeSelection = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelection = async (type: string) => {
    if (type === "individual") {
      router.push("/dashboard");
    } else if (type === "organization") {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/organization-exists', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.isOrganizationMember) {
          router.push("/organisationDashboard");
        } else {
          router.push("/organisationDetails");
        }
      } catch (error) {
        console.error("Error checking organization status:", error);
        router.push("/organisationDetails");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 py-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-orange-900/20 to-transparent opacity-20"></div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"
        ></motion.div>
      </div>

      {/* Header with TrueFeedback branding */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 flex items-center"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-3 flex items-center justify-center">
          <BarChart3 size={16} className="text-white" />
        </div>
        <div className="text-2xl font-bold">
          <span className="text-orange-500">True</span>
          <span className="text-white">Feedback</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 mt-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 mb-4">
          Choose Your Path
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">Select the experience that fits your needs</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full px-4"
      >
        {/* Individual Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          className="relative group cursor-pointer"
          onClick={() => handleSelection("individual")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/50 to-amber-600/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex flex-col p-8 rounded-2xl border border-orange-500/30 bg-gray-900/90 backdrop-blur-sm group-hover:border-orange-400/60 transition-all duration-300 h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:shadow-orange-600/40 transition-all duration-300"
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">Individual</h2>
                <p className="text-orange-400 text-sm font-medium">Personal Use</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              Perfect for personal feedback collection, anonymous messaging, and individual insights.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-6 flex-grow">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-gray-300 text-sm">Quick & Easy Setup</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-gray-300 text-sm">Anonymous Message Collection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-gray-300 text-sm">Personal Feedback Hub</span>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-3 px-6 rounded-xl group-hover:from-orange-400 group-hover:to-amber-500 transition-all duration-300"
            >
              <span>Start Personal Journey</span>
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.div>
          </div>
        </motion.div>

        {/* Organization Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          className={`relative group cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
          onClick={() => handleSelection("organization")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/50 to-amber-600/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex flex-col p-8 rounded-2xl border border-orange-500/30 bg-gray-900/90 backdrop-blur-sm group-hover:border-orange-400/60 transition-all duration-300 h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:shadow-orange-600/40 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </motion.div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">Organization</h2>
                <p className="text-orange-400 text-sm font-medium">Team & Business</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              Advanced polling system with <span className="text-orange-400 font-semibold">FastForwardPolls</span> - comprehensive feedback management for teams and businesses.
            </p>

            {/* Poll Types */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <ListChecks className="w-4 h-4 text-orange-400 mr-2" />
                Poll Types Available
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <CheckSquare className="w-3 h-3 text-orange-400" />
                  <span>Single Choice</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <ListChecks className="w-3 h-3 text-orange-400" />
                  <span>Multiple Choice</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Star className="w-3 h-3 text-orange-400" />
                  <span>Rating Scale</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Target className="w-3 h-3 text-orange-400" />
                  <span>Agree/Disagree</span>
                </div>
              </div>
            </div>

            {/* Analytics Features */}
            <div className="mb-6 flex-grow">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 text-orange-400 mr-2" />
                Advanced Analytics
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Real-time Data Visualization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <PieChart className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Comprehensive Reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Team Collaboration Tools</span>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-3 px-6 rounded-xl group-hover:from-orange-400 group-hover:to-amber-500 transition-all duration-300"
            >
              <span>{isLoading ? "Setting up..." : "Start Business Journey"}</span>
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          Both options include secure data collection, customizable dashboards, and seamless user experience. 
          Choose the one that best fits your feedback collection needs.
        </p>
      </motion.div>
    </div>
  );
};

export default UserTypeSelection;