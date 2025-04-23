import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CriteriaOrWhereOptions,
  entityFindAllByPaging,
} from 'src/commons/query.utils';
import { SwaggerService } from 'src/commons/swagger.service';
import { FindOneOptions, Repository } from 'typeorm';
import { GetPermissionDto } from './dto/get-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly swaggerService: SwaggerService,
  ) {}
  create(permission: Permission) {
    return this.permissionRepository.save(permission);
  }

  findAllServices() {
    const paths = this.swaggerService.getDocument()?.paths;
    type Service = {
      name: string;
      method: string;
      path: string;
      id: number;
      group: string;
    };
    const services: Service[] = [];
    for (const path in paths) {
      for (const method in paths[path]) {
        // console.log(paths[path][method]);
        services.push({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          name: paths[path][method].operationId,
          method: method.toUpperCase(),
          path: path
            .replaceAll('{path}', '*')
            .replaceAll('{', ':')
            .replaceAll('}', ''),
          id: services.length + 1,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          group: paths[path][method].operationId.replace(/Controller_.*/, ''),
        });
      }
    }
    return services;
  }

  findAll(getPermissionDto: GetPermissionDto) {
    return entityFindAllByPaging(this.permissionRepository, getPermissionDto);
  }

  findOne(
    criteriaOrWhereOptions: CriteriaOrWhereOptions<Permission>,
    findOneOptions?: FindOneOptions<Permission>,
  ) {
    return this.permissionRepository.findOne({
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
    criteriaOrWhereOptions: CriteriaOrWhereOptions<Permission>,
    partialEntity: Permission,
  ) {
    return this.permissionRepository.update(
      criteriaOrWhereOptions,
      partialEntity,
    );
  }

  remove(criteriaOrWhereOptions: CriteriaOrWhereOptions<Permission>) {
    return this.permissionRepository.softDelete(criteriaOrWhereOptions);
  }
}
