import { AvatarDropdown, AvatarName, Footer } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { ProConfigProvider, ProFormSelect, SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RuntimeConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import _ from 'lodash';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { usersControllerFindCurrent } from './services/swagger/users';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await usersControllerFindCurrent({ skipErrorHandler: true });
      return msg.data;
    } catch (error) {
      console.error(error);
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (![loginPath, '/user/register', '/user/register-result'].includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: '/api/v2',
  ...errorConfig,
};

export const rootContainer: RuntimeConfig['rootContainer'] = (rootElement) => (
  <ProConfigProvider
    valueTypeMap={{
      searchSelect: {
        renderFormItem: (entity: any, renderProps: any) => {
          return (
            <ProFormSelect
              {...renderProps.fieldProps}
              colProps={{
                span: 24,
              }}
              ignoreFormItem
              showSearch={true}
              request={async (input: any, props: any) => {
                if (input?.keyWords) {
                  input.name = input?.keyWords;
                } else if (props?.fieldProps?.value) {
                  input.id = props?.fieldProps?.value;
                }

                input.pageSize = 5;

                let params = Object.keys(input).reduce((prev: any, cur) => {
                  if (input[cur] && cur !== 'keyWords') {
                    prev[cur] = input[cur];
                  }
                  return prev;
                }, {});

                // 先获取5条，然后合并数据

                return Promise.all([
                  renderProps?.fieldProps?.searchRequest?.(params),
                  renderProps?.fieldProps?.searchRequest?.({
                    pageSize: input.pageSize,
                  }),
                ]).then((res) => {
                  return _.uniqBy(
                    [...res[0].data, ...res[1].data].map((item: any) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    }),
                    'value',
                  );
                });
              }}
            ></ProFormSelect>
          );
        },
      },
    }}
  >
    {rootElement}
  </ProConfigProvider>
);
