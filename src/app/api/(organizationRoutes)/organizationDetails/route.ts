import { NextRequest, NextResponse } from "next/server";
import { IncomingForm, File } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Organization from "@/model/organisation";
import dotenv from "dotenv";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import fs from "fs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Next.js route configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

class BufferReadable extends Readable {
  private sent = false;
  constructor(private buffer: Buffer) {
    super();
  }
  _read() {
    if (!this.sent) {
      this.push(this.buffer);
      this.sent = true;
    }
    this.push(null);
  }
}

async function toNodeRequest(req: NextRequest): Promise<IncomingMessage> {
  const buf = Buffer.from(await req.arrayBuffer());
  const stream = new BufferReadable(buf);
  const nodeReq = stream as unknown as IncomingMessage;

  Object.assign(nodeReq, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
  });
  return nodeReq;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Database connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Session verification
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }
    const username = session.user.username;

    // Form parsing
    const nodeReq = await toNodeRequest(req);
    const form = new IncomingForm();

    // Process form data
    const formData = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Input validation
    const name = formData.fields.name?.[0]?.trim();
    const description = formData.fields.description?.[0]?.trim();
    const logo = formData.files.logo?.[0] as File | undefined;

    if (!name || name.length < 3) {
      return NextResponse.json(
        { error: "Organization name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!logo) {
      return NextResponse.json(
        { error: "Organization logo is required" },
        { status: 400 }
      );
    }

    try {
      // Cloudinary upload
      const uploadResult = await cloudinary.uploader.upload(logo.filepath, {
        folder: "organization_logos",
      });

      // Clean up temp file
      fs.unlinkSync(logo.filepath);

      // Create organization
      const newOrg = new Organization({
        username,
        name,
        description,
        logoUrl: uploadResult.secure_url,
      });
      await newOrg.save();

      return NextResponse.json(
        {
          success: true,
          message: "Organization created successfully",
          organization: newOrg,
        },
        { status: 201 }
      );

    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      if (logo?.filepath) {
        try {
          fs.unlinkSync(logo.filepath);
        } catch (cleanupError) {
          console.error("Failed to clean up temp file:", cleanupError);
        }
      }
      return NextResponse.json(
        { error: "Failed to upload organization logo" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}