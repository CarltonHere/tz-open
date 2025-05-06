import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CriteriaOrWhereOptions,
  entityFindAllByPaging,
} from 'src/commons/query.utils';
import { Role } from 'src/roles/entities/role.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    // 检查是否创建admin和guest
    this.userRepository.findOne({ where: { username: 'admin' } }).then(
      (user) => {
        if (!user) {
          const _user = new User();
          _user.name = '管理员';
          _user.username = 'admin';
          _user.password = '123456';
          // 查找角色name为管理员的角色,如果不存在创建
          this.roleRepository.findOne({ where: { name: '管理员' } }).then(
            async (role: Role) => {
              if (!role) {
                const _role = new Role();
                _role.name = '管理员';
                _role.description = '系统创建默认角色';
              }
              _user.role = role;
              await this.userRepository.save(_user);
            },
            (err) => {
              console.log(err);
            },
          );
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(this.userRepository.create(createUserDto));
  }
  findAll(getUsersDto: GetUsersDto) {
    return entityFindAllByPaging(this.userRepository, {
      ...getUsersDto,
      relations: ['role'],
    });
  }

  findOne(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<User>,
    findOneOptions?: FindOneOptions<User>,
  ) {
    return this.userRepository.findOne({
      relations: ['role', 'role.permissions'],
      ...findOneOptions,
      where:
        typeof criteriaOrWhereOptions === 'string'
          ? {
              id: criteriaOrWhereOptions,
            }
          : criteriaOrWhereOptions,
    });
  }

  update(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<User>,
    partialEntity: UpdateUsersDto,
  ) {
    return this.userRepository.update(criteriaOrWhereOptions, partialEntity);
  }

  remove(criteriaOrWhereOptions: CriteriaOrWhereOptions<User>) {
    return this.userRepository.softDelete(criteriaOrWhereOptions);
  }
}
