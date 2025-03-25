import mongoose, { Document, Schema, model, Model } from "mongoose";

export interface IOrganization extends Document {
  username: string;
  name: string;
  description: string;
  logoUrl: string;
  createdAt: Date;
}

const OrganizationSchema: Schema<IOrganization> = new Schema({
  username: { type: String, required: true, unique: true, ref: "User" },
  name: { type: String, required: true, minlength: 3 },
  description: { type: String, required: true, minlength: 10 },
  logoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const OrganizationModel =
  (mongoose.models.Organization as Model<IOrganization>) ||
  model<IOrganization>("Organization", OrganizationSchema);

export default OrganizationModel;
