import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/postgres/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signup(createUser: UserDto): Promise<User> {
    const existingUser = await this.findUser(createUser.username);
    if (existingUser) {
      return null;
    }
    const user = new User();
    user.username = createUser.username;
    user.password = createUser.password;
    await user.hashPassword();
    const data = await this.userRepository.save(user);
    return data;
  }

  async login(user: UserDto): Promise<string> {
    const dbUser = await this.findUser(user.username);
    if (dbUser && dbUser.validatePassword(user.password)) {
      const cachedData = await this.cacheManager.get(user.username);
      console.log(cachedData);
      if (cachedData) return String(cachedData);
      const payload = { username: user.username };
      const jwt_token = await this.jwtService.signAsync(payload);
      await this.cacheManager.set(user.username, jwt_token);
      return jwt_token;
    }
    return null;
  }

  async logout(username: string): Promise<any> {
    return await this.cacheManager.del(username);
  }

  async findUser(username: string): Promise<User> {
    const dbUser = await this.userRepository.findOne({
      where: { username: username },
    });
    return dbUser;
  }
}
