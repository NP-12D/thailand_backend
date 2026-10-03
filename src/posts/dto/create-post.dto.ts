import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto {
  @ApiProperty({ example: 'My first post' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'This is the content of my first post.', maxLength: 300 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 300)
  content!: string;
}
