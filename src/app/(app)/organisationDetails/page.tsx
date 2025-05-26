'use client';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, BarChart3, Building2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const OrganizationDashboard = () => {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!orgName || orgName.length < 3) {
      setMessage("Organization name is required (min 3 characters)");
      return;
    }
    if (!orgDescription || orgDescription.length < 10) {
      setMessage("Description must be at least 10 characters long");
      return;
    }
    if (!logoFile) {
      setMessage("Logo is required");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", orgName);
      formData.append("description", orgDescription);
      formData.append("logo", logoFile);

      const res = await fetch("/api/organizationDetails", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage("Organization created successfully!");
        router.push("/organisationDashboard");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setMessage("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center">
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-2 sm:mr-3 flex items-center justify-center">
              <BarChart3 size={14} className="sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              <span className="text-orange-500">True</span>
              <span className="text-white">Feedback</span>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-700">
            <span className="text-orange-500 font-semibold text-xs sm:text-sm">FastForwardPolls</span>
            <span className="ml-1 sm:ml-2 text-xs text-gray-400">by <span className="text-orange-500">True</span><span className="text-white">Feedback</span></span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-12">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-2 sm:gap-0">
              <Building2 className="w-8 sm:w-12 h-8 sm:h-12 text-orange-500 sm:mr-4" />
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent text-center sm:text-left">
                Setup Your Organization
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Create your organization profile to start collecting powerful feedback with advanced polling capabilities and comprehensive analytics.
            </p>
          </motion.div>

          {/* Setup Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md sm:max-w-2xl"
          >
            <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/50 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-0">
              <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                
                {/* Logo Upload Section */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                    <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500 mr-2" />
                    Organization Logo
                  </h3>
                  <div className="relative group">
                    <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-xl sm:rounded-2xl border-2 border-dashed border-orange-500/50 hover:border-orange-500 transition-colors overflow-hidden bg-gray-800/50">
                      {logoPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={logoPreview}
                            alt="Organization Logo"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer text-white text-xs sm:text-sm font-medium text-center px-2">
                              Change Logo
                              <Input
                                type="file"
                                className="hidden"
                                onChange={handleLogoUpload}
                                accept="image/*"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer text-orange-400 hover:text-orange-300 transition-colors">
                          <UploadCloud size={24} className="sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                          <span className="text-xs sm:text-sm font-medium text-center">Upload Logo</span>
                          <span className="text-xs text-gray-500 mt-0.5 sm:mt-1 text-center px-1">PNG, JPG up to 5MB</span>
                          <Input
                            type="file"
                            className="hidden"
                            onChange={handleLogoUpload}
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Organization Name
                    </label>
                    <Input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Enter your organization name"
                      className="w-full bg-gray-800/60 backdrop-blur-sm text-white border border-gray-700 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Organization Description
                    </label>
                    <Textarea
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                      placeholder="Tell us about your organization and what you do..."
                      className="w-full bg-gray-800/60 backdrop-blur-sm text-white border border-gray-700 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 min-h-[100px] sm:min-h-[120px] resize-none transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Error/Success Message */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
                      message.includes("successfully") 
                        ? "bg-green-500/10 border-green-500/30 text-green-400" 
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Organization...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Building2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                      Create Organization
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 sm:mt-12 text-center px-4 sm:px-0"
          >
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Once created, you'll have access to:
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
              <span className="bg-gray-800/50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-orange-400 border border-gray-700">
                Advanced Poll Creation
              </span>
              <span className="bg-gray-800/50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-orange-400 border border-gray-700">
                Real-time Analytics
              </span>
              <span className="bg-gray-800/50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-orange-400 border border-gray-700">
                Team Collaboration
              </span>
              <span className="bg-gray-800/50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-orange-400 border border-gray-700">
                Custom Dashboards
              </span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="px-4 sm:px-8 py-4 sm:py-6 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            Powered by <span className="text-orange-500 font-medium">True</span><span className="text-white font-medium">Feedback</span> © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OrganizationDashboard;