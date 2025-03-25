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

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set runtime to Node.js and disable static optimization
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

class BufferReadable extends Readable {
  private sent: boolean = false;
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

export async function POST(req: NextRequest) {
  try {
    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Verify user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }
    const userUsername = session.user.username;

    // Parse form data
    const nodeReq = await toNodeRequest(req);
    const form = new IncomingForm();

    return new Promise((resolve) => {
      form.parse(nodeReq, async (err, fields, files) => {
        if (err) {
          return resolve(
            NextResponse.json(
              { error: "Error parsing form data" },
              { status: 400 }
            )
          );
        }

        // Validate input fields
        const name = fields.name?.[0]?.trim();
        const description = fields.description?.[0]?.trim();
        const logo = files.logo?.[0] as File | undefined;

        if (!name || name.length < 3) {
          return resolve(
            NextResponse.json(
              { error: "Organization name must be at least 3 characters" },
              { status: 400 }
            )
          );
        }

        if (!description || description.length < 10) {
          return resolve(
            NextResponse.json(
              { error: "Description must be at least 10 characters" },
              { status: 400 }
            )
          );
        }

        if (!logo) {
          return resolve(
            NextResponse.json(
              { error: "Organization logo is required" },
              { status: 400 }
            )
          );
        }

        try {
          // Upload logo to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(logo.filepath, {
            folder: "organization_logos",
          });

          // Clean up temporary file
          fs.unlinkSync(logo.filepath);

          // Create new organization
          const newOrg = new Organization({
            username: userUsername,
            name,
            description,
            logoUrl: uploadResult.secure_url,
          });

          await newOrg.save();

          return resolve(
            NextResponse.json(
              {
                success: true,
                message: "Organization created successfully",
                organization: newOrg,
              },
              { status: 201 }
            )
          );
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          if (logo?.filepath) {
            try {
              fs.unlinkSync(logo.filepath);
            } catch (error) {
              // Ignore deletion errors
            }
          }
          return resolve(
            NextResponse.json(
              { error: "Failed to upload organization logo" },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}