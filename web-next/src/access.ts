/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: any } | undefined) {
  const { currentUser } = initialState ?? {};
  // console.log('currentUser', currentUser);
  const permissions = currentUser?.role?.permissions
    ?.filter?.((item: any) => item.type === '0')
    ?.map?.((item: any) => `${item.path}|${item.method}`);
  // console.log('permissions', permissions);

  return {
    // adminRouteFilter: () => isAdmin, // 只有管理员可访问
    commonRouteFilter: (route: any) =>
      permissions?.includes?.(route.path + '|GET') || currentUser?.username === 'admin',
  };
}
