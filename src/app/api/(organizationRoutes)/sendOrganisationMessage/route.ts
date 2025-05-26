import OrganizationModel from "@/model/organisation";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const organization = await OrganizationModel.findOne({ username }).exec();

    if (!organization) {
      return Response.json(
        { message: "Organization not found", success: false },
        { status: 404 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date()
    };

    // Push the new message to the organization's messages array
    organization.messages.push(newMessage);
    await organization.save();

    return Response.json(
      { message: "Message added successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message to organization:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
