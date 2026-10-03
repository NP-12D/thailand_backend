import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, trim: true, maxlength: 80 })
  guestName!: string;

  @Prop({ required: true, min: 1, max: 20 })
  guests!: number;

  @Prop({ required: true, match: /^\d{4}-\d{2}-\d{2}$/ })
  date!: string;

  @Prop({ required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ })
  time!: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  user!: Types.ObjectId;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ user: 1, date: 1, time: 1 });
