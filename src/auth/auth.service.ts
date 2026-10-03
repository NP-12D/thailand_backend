import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign_up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign_in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const exsisitingUser = await this.userService.findOneByEmail(
      signUpDto.email,
    );
    if (exsisitingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPass = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.userService.create({ ...signUpDto, password: hashedPass });
    return { message: 'User created successfully', user: this.publicUser(user) };
  }

  async signIn(signInDto: SignInDto) {
    const exsisitingUser = await this.userService.findOneByEmail(
      signInDto.email,
    );
    if (!exsisitingUser)
      throw new UnauthorizedException('you are not registerd');
    const isEqualPass = await bcrypt.compare(
      signInDto.password,
      exsisitingUser.password,
    );
    if (!isEqualPass) throw new UnauthorizedException('Invalid credentials');
    const payLoad = {
      userId: exsisitingUser._id,
      role: exsisitingUser.role,
    };
    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });
    return { accessToken, user: this.publicUser(exsisitingUser) };
  }

  async currnetUser(userId: string) {
    return this.userService.findOne(userId);
  }

  private publicUser(user: { _id: unknown; firstName: string; lastName: string; email: string }) {
    return { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email };
  }
}
