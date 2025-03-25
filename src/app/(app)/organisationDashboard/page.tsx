'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { MessageCard } from "@/components/ui/MessageCard";
import { ApiResponse } from "../../../../types/ApiResponse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";

interface OrganizationData {
  _id: string;
  username: string;
  name: string;
  description: string;
  logoUrl: string;
  createdAt: string;
  __v: number;
}

function OrganizationDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [org, setOrg] = useState<OrganizationData | null>(null);

  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Fetch organization details from backend
  const fetchOrgDetails = useCallback(async () => {
    try {
      const res = await fetch("/api/getOrganisationDetails");
      const data = await res.json();
      if (res.ok && data.organization) {
        setOrg(data.organization);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch organization details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching organization details:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch messages and accept setting (if needed, similar to your individual dashboard)
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchOrgDetails();
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchOrgDetails, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const newValue = !acceptMessages;
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: newValue,
      });
      setValue("acceptMessages", newValue);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  if (!session || !session.user || !org) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Get logged-in user's username from session
  const { username: userUsername } = session.user as { username: string };

  // Construct unique URL: baseUrl/u/org/{org.username}/{user.username}
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/org/${org.name}/${userUsername}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Organization unique URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 mx-4 sm:mx-6 md:mx-8 lg:mx-auto p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-w-6xl">
      {/* Organization Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8 px-4"
      >
        {org.logoUrl && (
          <img
            src={org.logoUrl}
            alt="Organization Logo"
            className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-indigo-500 shadow-lg"
          />
        )}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 leading-tight">
          {org.name}
        </h1>
        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Your Anonymous Feedback Platform
        </p>
      </motion.div>

      {/* Dashboard Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-center"
      >
        Organization Dashboard
      </motion.h1>

      {/* Unique Link Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-300">
          Copy Your Unique Organization Link
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 transform"
          >
            Copy
          </Button>
        </div>
      </motion.div>

      {/* Accept Messages Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-4 flex items-center justify-center"
      >
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="data-[state=checked]:bg-indigo-500"
        />
        <span className="ml-2 text-gray-300">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </motion.div>

      <Separator className="bg-gray-700" />

      {/* Refresh Messages Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-4 flex justify-center"
      >
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="bg-gray-700 text-white hover:bg-gray-600 hover:scale-105 transform"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      {/* Messages Grid */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-300 text-center">
            No messages to display.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default OrganizationDashboard;
