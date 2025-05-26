// pages/api/poll/submit.ts

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import PollFormModel from "@/model/pollFormModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { slug, responses } = req.body;

  if (!slug || !Array.isArray(responses)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const poll = await PollFormModel.findOne({ slug });

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Validate response length
    if (responses.length !== poll.questions.length) {
      return res.status(400).json({ message: "Mismatch in number of responses" });
    }

    // Optional: Validate response types match question types here

    // Save anonymous response
    poll.responses.push({
      answers: responses,
      submittedAt: new Date()
    });

    await poll.save();

    return res.status(200).json({ message: "Response submitted successfully" });
  } catch (err) {
    console.error("Error submitting response:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
