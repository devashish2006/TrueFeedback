import mongoose, { Schema, Document, Types, Model } from "mongoose";

type PollType = "single" | "multiple" | "agree" | "rating";

interface IQuestion {
  questionText: string;
  type: PollType;
  options?: string[];     // For single & multiple choice
  ratingScale?: number;   // For rating type (e.g., 1–5)
}

interface IResponse {
  answers: {
    questionId: Types.ObjectId;
    selectedOptions?: string[];  // for single/multiple
    agreement?: boolean;         // for agree/disagree
    rating?: number;             // for rating
  }[];
  submittedAt: Date;
}

export interface IPollForm extends Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  responses: IResponse[];
  createdBy: Types.ObjectId;       // ref to User
  organization: Types.ObjectId;    // ref to Organization
  slug: string;                    // for public anonymous access
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["single", "multiple", "agree", "rating"],
  },
  options: [String],
  ratingScale: { type: Number, default: 5 },
});

const ResponseSchema = new Schema<IResponse>({
  answers: [
    {
      questionId: { type: Schema.Types.ObjectId, required: true },
      selectedOptions: [String],
      agreement: Boolean,
      rating: Number,
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

const PollFormSchema = new Schema<IPollForm>({
  title: { type: String, required: true },
  description: { type: String },
  questions: { type: [QuestionSchema], required: true },
  responses: { type: [ResponseSchema], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
}); 

const PollFormModel: Model<IPollForm> =
  mongoose.models.PollForm || mongoose.model<IPollForm>("PollForm", PollFormSchema);

export default PollFormModel;
