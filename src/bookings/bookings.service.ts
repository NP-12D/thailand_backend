import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schema/booking.schema';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<Booking>) {}

  create(userId: string, values: CreateBookingDto) {
    return this.bookingModel.create({ ...values, user: userId });
  }

  findMine(userId: string) {
    return this.bookingModel.find({ user: userId }).sort({ date: 1, time: 1 }).exec();
  }

  async updateMine(userId: string, bookingId: string, values: UpdateBookingDto) {
    if (!isValidObjectId(bookingId)) throw new BadRequestException('Invalid booking ID');
    const booking = await this.bookingModel.findOneAndUpdate(
      { _id: bookingId, user: userId },
      values,
      { new: true, runValidators: true },
    ).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async removeMine(userId: string, bookingId: string) {
    if (!isValidObjectId(bookingId)) throw new BadRequestException('Invalid booking ID');
    const booking = await this.bookingModel.findOneAndDelete({ _id: bookingId, user: userId }).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
