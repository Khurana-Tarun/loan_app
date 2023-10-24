import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  LoggerService,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { CommonApiResponse } from 'src/shared/response/utilities';
import { UserService } from './user.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthGuard } from './auth-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post('')
  @ApiTags('User')
  @ApiBearerAuth()
  async createUser(@Body() user: UserDto): Promise<CommonApiResponse> {
    try {
      const data = await this.userService.signup(user);
      let res = null;
      if (data) {
        res = new CommonApiResponse(HttpStatus.OK, 'Successful Signup', null);
      } else {
        res = new CommonApiResponse(
          HttpStatus.BAD_REQUEST,
          'User with username alredy exist',
          { username: user.username },
        );
      }
      return res;
    } catch (err) {
      this.logger.error('Error while creatign a user', {
        error: err,
        data: user.username,
      });
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }

  @Post('login')
  @ApiTags('User')
  async login(@Body() user: UserDto): Promise<CommonApiResponse> {
    try {
      const data = await this.userService.login(user);
      let res = null;
      if (data) {
        res = new CommonApiResponse(HttpStatus.OK, 'Successful login', {
          access_token: data,
        });
      } else {
        res = new CommonApiResponse(
          HttpStatus.BAD_REQUEST,
          'Invalid credentials',
          user.username,
        );
      }
      return res;
    } catch (err) {
      this.logger.error('Error while creatign a user', {
        error: err,
        data: user.username,
      });
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiTags('User')
  @ApiBearerAuth()
  async logout(@Request() req: any): Promise<CommonApiResponse> {
    try {
      await this.userService.logout(req.user.username);
      return new CommonApiResponse(HttpStatus.OK, 'Successful Logout', null);
    } catch (err) {
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }
}
