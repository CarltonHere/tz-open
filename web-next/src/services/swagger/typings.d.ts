declare namespace API {
  type ApiKey = {};

  type ApiKeysControllerFindAllParams = {
    /** 选择字段 */
    select?: string[];
    /** 关联实体 */
    relations?: string[];
    /** 排序字段 */
    order?: Object;
    /** 当前页 */
    current?: number;
    /** 页面尺寸 */
    pageSize?: number;
  };

  type ApiKeysControllerFindOneParams = {
    id: string;
  };

  type ApiKeysControllerRemoveParams = {
    id: string;
  };

  type ApiKeysControllerUpdateParams = {
    id: string;
  };

  type ApisControllerFindAllParams = {
    /** 选择字段 */
    select?: string[];
    /** 关联实体 */
    relations?: string[];
    /** 排序字段 */
    order?: Object;
    /** 当前页 */
    current?: number;
    /** 页面尺寸 */
    pageSize?: number;
  };

  type ApisControllerFindOneParams = {
    id: string;
  };

  type ApisControllerRemoveParams = {
    id: string;
  };

  type ApisControllerUpdateParams = {
    id: string;
  };

  type AuthControllerFindOneParams = {
    id: string;
  };

  type AuthControllerRemoveParams = {
    id: string;
  };

  type AuthControllerUpdateParams = {
    id: string;
  };

  type CreateApiDto = {
    /** 接口名称 */
    name: string;
    /** 接口标记 */
    symbol: string;
    /** 接口地址 */
    base_url: string;
    /** 接口令牌 */
    access_token: string;
    /** 最大并发数 */
    concurrency: number;
  };

  type CreateApiKeyDto = {};

  type CreateAuthDto = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type CreateOpenDto = {};

  type CreateUserDto = {
    /** 名称 */
    name: string;
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 邮箱 */
    email: string;
    /** 头像 */
    avatar: string;
    /** 角色 */
    role?: Role;
    /** 状态 ["ENABLED","DISABLED"] */
    status: string;
  };

  type Object = {};

  type OpenControllerFindOne0Params = {
    id: string;
  };

  type OpenControllerFindOne1Params = {
    id: string;
  };

  type OpenControllerProxyDeleteParams = {
    apiName: any;
  };

  type OpenControllerProxyDeleteParams = {
    apiName: any;
  };

  type OpenControllerProxyGetParams = {
    apiName: any;
  };

  type OpenControllerProxyGetParams = {
    apiName: any;
  };

  type OpenControllerProxyPatchParams = {
    apiName: any;
  };

  type OpenControllerProxyPatchParams = {
    apiName: any;
  };

  type OpenControllerProxyPostParams = {
    apiName: any;
  };

  type OpenControllerProxyPostParams = {
    apiName: any;
  };

  type OpenControllerProxyPutParams = {
    apiName: any;
  };

  type OpenControllerProxyPutParams = {
    apiName: any;
  };

  type OpenControllerRemove0Params = {
    id: string;
  };

  type OpenControllerRemove1Params = {
    id: string;
  };

  type OpenControllerUpdate0Params = {
    id: string;
  };

  type OpenControllerUpdate1Params = {
    id: string;
  };

  type Permission = {
    /** 状态 ["ENABLED","DISABLED"] */
    status: string;
  };

  type PermissionsControllerFindAllParams = {
    /** ["ENABLED","DISABLED"] */
    'filter[status]'?: string;
    /** 选择字段 */
    select?: string[];
    /** 关联实体 */
    relations?: string[];
    /** 排序字段 */
    order?: Object;
    /** 当前页 */
    current?: number;
    /** 页面尺寸 */
    pageSize?: number;
  };

  type PermissionsControllerFindOneParams = {
    id: string;
  };

  type PermissionsControllerRemoveParams = {
    id: string;
  };

  type PermissionsControllerUpdateParams = {
    id: string;
  };

  type Role = {
    /** 名称 */
    name: string;
    /** 状态 ["ENABLED","DISABLED"] */
    status?: string;
    /** 描述信息 */
    description?: string;
    /** 权限 */
    permissions?: Permission[];
  };

  type RolesControllerFindAllParams = {
    'filter[name]'?: string;
    /** ["ENABLED","DISABLED"] */
    'filter[status]'?: string;
    'filter[description]'?: string;
    /** 权限 */
    'filter[permissions]'?: Permission[];
    /** 选择字段 */
    select?: string[];
    /** 关联实体 */
    relations?: string[];
    /** 排序字段 */
    order?: Object;
    /** 当前页 */
    current?: number;
    /** 页面尺寸 */
    pageSize?: number;
  };

  type RolesControllerFindOneParams = {
    id: string;
  };

  type RolesControllerRemoveParams = {
    id: string;
  };

  type RolesControllerUpdateParams = {
    id: string;
  };

  type UpdateApiDto = {};

  type UpdateAuthDto = {
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
  };

  type UpdateOpenDto = {};

  type UpdateUsersDto = {
    /** 名称 */
    name?: string;
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
    /** 邮箱 */
    email?: string;
    /** 头像 */
    avatar?: string;
    /** 角色 */
    role?: Role;
    /** 状态 ["ENABLED","DISABLED"] */
    status?: string;
  };

  type UsersControllerFindAllParams = {
    'filter[name]'?: string;
    'filter[username]'?: string;
    'filter[password]'?: string;
    'filter[email]'?: string;
    'filter[avatar]'?: string;
    'filter[role]'?: Role;
    /** ["ENABLED","DISABLED"] */
    'filter[status]'?: string;
    /** 选择字段 */
    select?: string[];
    /** 关联实体 */
    relations?: string[];
    /** 排序字段 */
    order?: Object;
    /** 当前页 */
    current?: number;
    /** 页面尺寸 */
    pageSize?: number;
  };

  type UsersControllerFindOneParams = {
    id: string;
  };

  type UsersControllerRemoveParams = {
    id: string;
  };

  type UsersControllerUpdateParams = {
    id: string;
  };
}
