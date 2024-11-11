import mongoose, { Schema, Document } from 'mongoose';

interface Comment extends Document {
  text: string;
  rating: number;
  author: mongoose.Schema.Types.ObjectId;
  rentOffer: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    text: { type: String, required: true, minlength: 5, maxlength: 1024 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rentOffer: { type: Schema.Types.ObjectId, ref: 'RentOffer', required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);

export default CommentModel;
