declare namespace API {
  type ApiKeyControllerFindOneParams = {
    id: number;
  };

  type ApiKeyControllerRemoveParams = {
    id: string;
  };

  type ApiKeyControllerUpdateParams = {
    id: number;
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
    /** 接口单价 */
    price: number;
    /** 计价类型 {"0":"单次计费","1":"单向字数计费","2":"双向字数计费"} */
    priceType: '0' | '1' | '2';
  };

  type CreateApiKeyDto = {};

  type CreateBalanceDto = {
    /** 充值额度 */
    amount: number;
  };

  type CreatePermissionDto = {
    /** 路径 */
    path: string;
    /** 请求类型 {"0":"POST","1":"GET","2":"PATCH","4":"DELETE"} */
    method: '0' | '1' | '2' | '4';
    /** 权限类型 {"0":"Service","1":"Web"} */
    type: '0' | '1';
  };

  type CreateRoleDto = {
    /** 用户组名 */
    name: string;
  };

  type CreateUserDto = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 邮箱 */
    email: string;
    /** 昵称 */
    name: string;
  };

  type LoginByPasswordDto = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type OpenControllerProxyDeleteParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyDeleteParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyGetParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyGetParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyPatchParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyPatchParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyPostParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyPostParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyPutParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type OpenControllerProxyPutParams = {
    /** 远程接口路径 */
    apiUrl: any;
    apiName: any;
  };

  type PermissionControllerFindOneParams = {
    id: string;
  };

  type PermissionControllerRemoveParams = {
    id: string;
  };

  type PermissionControllerUpdateParams = {
    id: string;
  };

  type RoleControllerFindOneParams = {
    id: string;
  };

  type RoleControllerRemoveParams = {
    id: string;
  };

  type RoleControllerUpdateParams = {
    id: string;
  };

  type UpdateApiKeyDto = {};

  type UpdatePermissionDto = {
    /** 路径 */
    path?: string;
    /** 请求类型 {"0":"POST","1":"GET","2":"PATCH","4":"DELETE"} */
    method?: '0' | '1' | '2' | '4';
    /** 权限类型 {"0":"Service","1":"Web"} */
    type?: '0' | '1';
  };

  type UpdateRoleDto = {
    /** 用户组名 */
    name?: string;
  };

  type UserControllerFindOneParams = {
    id: string;
  };
}
