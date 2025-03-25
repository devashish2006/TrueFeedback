'use client';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const OrganizationDashboard = () => {
  const router = useRouter();
  const [orgName, setOrgName] = useState("My Organization");
  const [orgDescription, setOrgDescription] = useState("Your organization's description goes here...");
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
      // Create FormData and append fields
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
        // Redirect to organization dashboard (or a confirmation page)
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        {orgName}
      </motion.div>

      <Card className="w-full max-w-2xl p-6 bg-gray-800 shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative w-32 h-32 rounded-full border-2 border-gray-400 overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Organization Logo" className="w-full h-full object-cover" />
            ) : (
              <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer text-gray-400 hover:text-gray-200">
                <UploadCloud size={40} />
                <span className="text-sm">Upload Logo</span>
                <Input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </label>
            )}
          </div>

          <Input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Organization Name"
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-md p-3"
          />

          <Textarea
            className="w-full text-gray-300 bg-gray-700 p-3 rounded-md"
            value={orgDescription}
            onChange={(e) => setOrgDescription(e.target.value)}
            placeholder="Organization Description"
          />
          
          {message && <p className="text-red-400">{message}</p>}

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-500" 
            onClick={handleSaveChanges}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationDashboard;
