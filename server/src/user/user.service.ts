import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from 'src/balance/entities/balance.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // 初始化钱包
    const balance = new Balance();
    balance.amount = 100;
    const user = await this.userRepository.save({
      ...createUserDto,
      // 默认走角色1
      role: {
        id: 1,
      },
      balance: balance,
    });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number, relations = ['role'], cache = 60 * 60 * 1000) {
    return this.userRepository.findOne({
      where: { id },
      cache,
      relations,
    });
  }

  findUser(user: User) {
    return this.userRepository.findOne({
      where: user,
      cache: 60 * 60 * 1000,
    });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      cache: 60 * 60 * 1000,
    });
  }

  login(username: string, password: string) {
    return this.userRepository.findOne({
      where: { username, password },
      cache: 60 * 60 * 1000,
    });
  }
}
