import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "trueFeedback – Anonymous Feedback Made Simple",
  description: "Get anonymous, honest feedback in seconds. Perfect for creators, teams, and personal growth.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "trueFeedback – Anonymous Feedback Made Simple",
    description: "Get real, anonymous feedback in seconds. Empower your growth with trueFeedback.",
    url: "https://truefeedback.xyz",
    siteName: "trueFeedback",
    images: [
      {
        url: "https://truefeedback.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "trueFeedback – Get Anonymous Feedback",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "trueFeedback – Anonymous Feedback Made Simple",
    description: "Share and receive real, anonymous feedback instantly. Try trueFeedback now.",
    images: ["https://truefeedback.xyz/og-image.png"],
  },
};

export const viewport = {
  themeColor: "#ffffff",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
