import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private userService: UsersService,
  ) {}

  async create(userId, createPostDto: CreatePostDto) {
    const newPost = await this.postModel.create({
      ...createPostDto,
      user: userId,
    });
    await this.userService.addPost(userId, newPost._id);
    return newPost;
  }

  findAll() {
    return this.postModel.find().populate('user');
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid MongoDB ID');
    const post = await this.postModel
      .findById(id)
      .populate('user', '-password');
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid MongoDB ID');
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, {
        new: true,
      })
      .populate('user', '-password');
    if (!updatedPost) throw new NotFoundException('Post not found');
    return updatedPost;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid Mongo ID');
    const deletedPost = await this.postModel.findByIdAndDelete(id);
    if (!deletedPost) throw new NotFoundException('Post not found');

    return deletedPost;
  }
}
