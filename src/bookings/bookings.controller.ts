import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('bookings')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking for the authenticated user' })
  create(@User() userId: string, @Body() values: CreateBookingDto) {
    return this.bookingsService.create(userId, values);
  }

  @Get()
  @ApiOperation({ summary: 'List the authenticated user’s bookings' })
  findMine(@User() userId: string) {
    return this.bookingsService.findMine(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one of the authenticated user’s bookings' })
  update(@User() userId: string, @Param('id') id: string, @Body() values: UpdateBookingDto) {
    return this.bookingsService.updateMine(userId, id, values);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel one of the authenticated user’s bookings' })
  remove(@User() userId: string, @Param('id') id: string) {
    return this.bookingsService.removeMine(userId, id);
  }
}
