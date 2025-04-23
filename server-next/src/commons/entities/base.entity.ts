import { Allow } from 'class-validator';
import {
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v7 as uuidv7 } from 'uuid';

function PrimaryUUIDv7(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    // 使用 @PrimaryColumn 装饰器定义列，并指定类型为 'uuid'
    PrimaryGeneratedColumn('uuid')(target, propertyKey);

    // 定义 BeforeInsert 事件处理函数
    const beforeInsertHandler = function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!this[propertyKey]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this[propertyKey] = uuidv7();
      }
    };

    // 添加 BeforeInsert 监听器
    BeforeInsert()(target, beforeInsertHandler.name);

    // 将事件处理器添加到实体实例原型上
    Object.defineProperty(
      target.constructor.prototype,
      beforeInsertHandler.name,
      {
        value: beforeInsertHandler,
        writable: true,
        configurable: true,
        enumerable: false,
      },
    );
  };
}

export abstract class EnhancedBaseEntity {
  @Allow()
  @PrimaryUUIDv7()
  id?: string;

  @Allow()
  @CreateDateColumn({ type: 'timestamp' })
  create_time?: Date;

  @Allow()
  @UpdateDateColumn({ type: 'timestamp' })
  update_time?: Date;

  @Allow()
  @DeleteDateColumn({ type: 'timestamp' })
  delete_time?: Date;
}
