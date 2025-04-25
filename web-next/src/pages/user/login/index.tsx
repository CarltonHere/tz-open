import { Footer } from '@/components';
// import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { authControllerCreate } from '@/services/swagger/auth';
import {
  AlipayOutlined,
  LockOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Divider, message, Space, Tabs, theme } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(() => {
  return {
    action: {
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '18px',
      verticalAlign: 'middle',
      cursor: 'pointer',
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const { token } = theme.useToken();
  const [userLoginState, setUserLoginState] = useState<any>({});
  const [loginType, setLoginType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.CreateAuthDto & { rememberMe: boolean }) => {
    try {
      // 登录
      const response = await authControllerCreate(values);
      if (response.data.access_token) {
        message.success('登录成功！');
        localStorage.setItem('Authentication', response.data.access_token);
        // 如果记住密码
        if (values.rememberMe) {
          localStorage.setItem('RememberMe', JSON.stringify(values));
        } else {
          localStorage.removeItem('RememberMe');
        }
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.errorMessage) {
        setUserLoginState({
          errorMessage: error?.response?.data?.errorMessage,
          loginType,
        });
      }
    }
  };

  return (
    <ProConfigProvider>
      <div
        style={{
          height: '100vh',
        }}
      >
        <Helmet>
          <title>登录页 - {Settings.title}</title>
        </Helmet>
        <LoginFormPage
          backgroundImageUrl="/images/5.jpg"
          logo={'/logo.svg'}
          title="天职国际开放平台"
          subTitle={'资源一体化开放共享平台'}
          onFinish={async (values: API.CreateAuthDto & { rememberMe: boolean }) => {
            await handleSubmit(values);
          }}
          request={async () => JSON.parse(localStorage.getItem('RememberMe') ?? '')}
          actions={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Divider plain>
                <span
                  style={{
                    color: token.colorTextPlaceholder,
                    fontWeight: 'normal',
                    fontSize: 14,
                  }}
                >
                  其他登录方式
                </span>
              </Divider>
              <Space align="center" size={24}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 40,
                    width: 40,
                    border: '1px solid ' + token.colorPrimaryBorder,
                    borderRadius: '50%',
                  }}
                >
                  <AlipayOutlined className={styles.action} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 40,
                    width: 40,
                    border: '1px solid ' + token.colorPrimaryBorder,
                    borderRadius: '50%',
                  }}
                >
                  <TaobaoOutlined className={styles.action} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 40,
                    width: 40,
                    border: '1px solid ' + token.colorPrimaryBorder,
                    borderRadius: '50%',
                  }}
                >
                  <WeiboOutlined className={styles.action} />
                </div>
              </Space>
            </div>
          }
        >
          <Tabs centered activeKey={loginType}>
            <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
            <Tabs.TabPane key={'phone'} tab={'手机号登录'} />
          </Tabs>
          {userLoginState?.errorMessage && userLoginState?.loginType === 'account' && (
            <LoginMessage content={userLoginState?.errorMessage} />
          )}
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="rememberMe">
              记住密码
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginFormPage>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Footer />
        </div>
      </div>
    </ProConfigProvider>
  );
};

export default Login;
