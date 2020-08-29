import {
  Document, Model, Schema, model
} from 'mongoose';

export interface IUrl extends Document {
  /** Name of the book */
  urlCode: string;
  /** Name of the author */
  longUrl: string;
  /** Name of the author */
  shortUrl: string;
  /** Name of the author */
  clickCount: number;
}

interface IUrlModel extends Model<IUrl> { }

const schema = new Schema({
  urlCode: { type: String, required: true },
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clickCount: { type: Number, required: true }
});

export const Url: IUrlModel = model<IUrl, IUrlModel>('Url', schema);
