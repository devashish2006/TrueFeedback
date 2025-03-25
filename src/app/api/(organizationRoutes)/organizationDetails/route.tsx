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
import { authOptions } from "../../auth/[...nextauth]/options"; // Adjust this path as needed

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Custom Readable stream that emits the buffer
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

// Convert NextRequest to a Node.js IncomingMessage
async function toNodeRequest(req: NextRequest): Promise<IncomingMessage> {
  const buf = Buffer.from(await req.arrayBuffer());
  const stream = new BufferReadable(buf);

  // Cast our stream to IncomingMessage. This may not fulfill all IncomingMessage properties,
  // but it's sufficient for Formidable to work.
  const nodeReq = stream as unknown as IncomingMessage;

  // Attach headers and method from NextRequest
  Object.assign(nodeReq, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
  });
  return nodeReq;
}

// Named export for POST method
export async function POST(req: NextRequest) {
  try {
    // Ensure DB connection is established
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Retrieve session to get the username
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.username) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userUsername = session.user.username;

    const nodeReq = await toNodeRequest(req);
    const form = new IncomingForm();

    return new Promise((resolve) => {
      form.parse(nodeReq, async (err, fields, files) => {
        if (err) {
          return resolve(NextResponse.json({ error: "Form parsing error" }, { status: 400 }));
        }

        const name = fields.name?.[0];
        const description = fields.description?.[0];
        const logo = files.logo?.[0] as File | undefined;

        if (!name || name.length < 3) {
          return resolve(
            NextResponse.json({ error: "Organization name is required (min 3 characters)" }, { status: 400 })
          );
        }
        if (!description || description.length < 10) {
          return resolve(
            NextResponse.json({ error: "Description must be at least 10 characters long" }, { status: 400 })
          );
        }
        if (!logo) {
          return resolve(
            NextResponse.json({ error: "Logo is required" }, { status: 400 })
          );
        }

        const logoPath = logo.filepath;

        try {
          // Upload image to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(logoPath, {
            folder: "organization_logos",
          });

          // Remove temporary file
          fs.unlinkSync(logoPath);

          // Save new organization to MongoDB including the username from session
          const newOrg = new Organization({
            username: userUsername,
            name,
            description,
            logoUrl: uploadResult.secure_url,
          });
          await newOrg.save();

          return resolve(
            NextResponse.json({ message: "Organization created", organization: newOrg }, { status: 201 })
          );
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          return resolve(
            NextResponse.json({ error: "Image upload failed" }, { status: 500 })
          );
        }
      });
    });
  } catch (error) {
    console.error("Error in POST /api/organizationDetails:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
