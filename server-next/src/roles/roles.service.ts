import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CriteriaOrWhereOptions,
  entityFindAllByPaging,
} from 'src/commons/query.utils';
import { Permission } from 'src/permissions/entities/permission.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { GetRoleDto } from './dto/get-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    // 检测是否有一个name为Public的角色，没有就创建
    this.roleRepository.findOne({ where: { name: 'Public' } }).then(
      async (role) => {
        if (!role) {
          // const _role = new Role();
          // _role.name = 'Public';
          // _role.description = '系统创建默认角色';
          // this.roleRepository.save(_role);
          await this.create({
            name: 'Public',
            description: '系统创建默认角色',
            permissions: [
              {
                path: '/auth/login',
                method: 'POST',
                type: '1',
              },
            ],
          });
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }
  create(role: Role) {
    const permissions = (role.permissions as Permission[]).map((item) => {
      const permission = new Permission();
      permission.path = item.path;
      permission.method = item.method;
      permission.type = item.type;
      return permission;
    });
    role.permissions = permissions;
    // 此处使用了级联自动保存(需要在Role实体OneToMany添加属性{ cascade: true })
    return this.roleRepository.save(role);
  }

  findAll(getRoleDto: GetRoleDto) {
    return entityFindAllByPaging(this.roleRepository, getRoleDto);
  }

  findOne(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<Role>,
    findOneOptions?: FindOneOptions<Role>,
  ) {
    return this.roleRepository.findOne({
      ...findOneOptions,
      where:
        typeof criteriaOrWhereOptions === 'string'
          ? {
              id: criteriaOrWhereOptions,
            }
          : criteriaOrWhereOptions,
    });
  }

  async update(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<Role>,
    partialEntity: Role,
  ) {
    // 删除所有这个角色id的权限
    // 根据id获取role
    const _role = await this.roleRepository.findOne({
      where:
        typeof criteriaOrWhereOptions === 'string'
          ? {
              id: criteriaOrWhereOptions,
            }
          : criteriaOrWhereOptions,
    });

    await this.permissionRepository.delete({
      role: _role as Role,
    });
    // 然后重新创建权限
    const permissions = (partialEntity.permissions as Permission[]).map(
      (item) => {
        const permission = new Permission();
        permission.path = item.path;
        permission.method = item.method;
        permission.type = item.type;
        permission.strategy = item.strategy;
        return permission;
      },
    );
    partialEntity.permissions = permissions;
    partialEntity.id = (_role as Role).id;
    return this.roleRepository.save(partialEntity);
  }

  remove(criteriaOrWhereOptions: CriteriaOrWhereOptions<Role>) {
    return this.roleRepository.softDelete(criteriaOrWhereOptions);
  }
}
