import { Type as _Type } from '@nestjs/common';
import {
  applyIsOptionalDecorator,
  applyValidateIfDefinedDecorator,
  inheritPropertyInitializers,
} from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { MetadataLoader } from '@nestjs/swagger/dist/plugin/metadata-loader';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';
import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class CustomSortValidator implements ValidatorConstraintInterface {
  validate(record: Record<string, string>) {
    return Object.values(record).every((value) =>
      ['ASC', 'DESC'].includes(value),
    );
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} must be an object with keys as field names and values as "ASC" or "DESC"`;
  }
}

export class QueryDto {
  @Allow()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: '选择字段',
    required: false,
  })
  select?: string[];

  @Allow()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: '关联实体',
    required: false,
  })
  relations?: string[];

  @Allow()
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Validate(CustomSortValidator)
  @ApiProperty({
    description: '排序字段',
    required: false,
  })
  order?: Record<string, 'ASC' | 'DESC'>;

  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '页码格式错误' })
  @Min(1, { message: '页面尺寸最小为1' })
  @ApiProperty({
    description: '当前页',
    example: 1,
    required: false,
  })
  current?: number;

  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '页面尺寸格式错误' })
  @Max(100, { message: '页面尺寸最大为100' })
  @Min(1, { message: '页面尺寸最小为1' })
  @ApiProperty({
    description: '页面尺寸',
    example: 10,
    required: false,
  })
  pageSize?: number;
}

export function QueryPartialType<T>(
  classRef: _Type<T>,
  /**
   *  Configuration options.
   */
  options: {
    /**
     * If true, validations will be ignored on a property if it is either null or undefined. If
     * false, validations will be ignored only if the property is undefined.
     * @default true
     */
    skipNullProperties?: boolean;
  } = {},
) {
  const applyPartialDecoratorFn =
    options.skipNullProperties === false
      ? applyValidateIfDefinedDecorator
      : applyIsOptionalDecorator;
  const modelPropertiesAccessor = new ModelPropertiesAccessor();
  const fields = modelPropertiesAccessor.getModelProperties(
    classRef.prototype as _Type<unknown>,
  );

  abstract class PartialTypeClass {
    constructor() {
      inheritPropertyInitializers(this, classRef);
    }

    @Type(() => classRef)
    @ValidateNested()
    filter?: Partial<T>;
  }

  function applyFields(fields: string[]) {
    fields.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metadata =
        Reflect.getMetadata(
          DECORATORS.API_MODEL_PROPERTIES,
          classRef.prototype as object,
          key,
        ) || {};

      const decoratorFactory = ApiProperty({
        ...metadata,
        required: false,
      } as ApiPropertyOptions);
      decoratorFactory(PartialTypeClass.prototype, `filter[${key}]`);
      applyPartialDecoratorFn(PartialTypeClass, `filter[${key}]`);
    });

    // // 验证器修饰符
    // const typeDecoratorFactory = Type(() => classRef);
    // typeDecoratorFactory(PartialTypeClass.prototype, 'filter');
    // const validateDecoratorFactory = ValidateNested();
    // validateDecoratorFactory(PartialTypeClass.prototype, 'filter');
  }
  applyFields(fields);

  MetadataLoader.addRefreshHook(() => {
    const fields = modelPropertiesAccessor.getModelProperties(
      classRef.prototype as _Type<unknown>,
    );
    applyFields(fields);
  });

  // return PartialTypeClass as Type<Partial<T>>;
  return PartialTypeClass as _Type<{
    filter?: Partial<T>;
  }>;
}
