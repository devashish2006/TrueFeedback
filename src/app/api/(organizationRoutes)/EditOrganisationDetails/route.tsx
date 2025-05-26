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

// Changed from PUT to POST to match frontend
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

    // Check if organization exists and belongs to user
    const existingOrg = await Organization.findOne({ username });
    if (!existingOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

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
    const description = formData.fields.description?.[0]?.trim();
    const logo = formData.files.logo?.[0] as File | undefined;

    // Validate description if provided
    if (description !== undefined && description.length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    // Update description if provided
    if (description !== undefined) {
      updateData.description = description;
    }

    // Handle logo upload if provided
    let newLogoUrl = null;
    if (logo) {
      try {
        // Upload new logo to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(logo.filepath, {
          folder: "organization_logos",
        });

        // Clean up temp file
        fs.unlinkSync(logo.filepath);

        newLogoUrl = uploadResult.secure_url;
        updateData.logoUrl = newLogoUrl;

        // Delete old logo from Cloudinary (optional)
        if (existingOrg.logoUrl) {
          try {
            // Extract public_id from the existing logo URL
            const urlParts = existingOrg.logoUrl.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `organization_logos/${publicIdWithExtension.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
          } catch (deleteError) {
            console.warn("Failed to delete old logo from Cloudinary:", deleteError);
            // Continue with the update even if old logo deletion fails
          }
        }

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
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Update organization
    const updatedOrg = await Organization.findOneAndUpdate(
      { username },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrg) {
      return NextResponse.json(
        { error: "Failed to update organization" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Organization updated successfully",
        organization: updatedOrg,
        updatedFields: Object.keys(updateData),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}