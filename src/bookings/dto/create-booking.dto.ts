import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  guestName!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  guests!: number;

  @IsDateString()
  date!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'time must be in HH:mm format' })
  time!: string;
}
