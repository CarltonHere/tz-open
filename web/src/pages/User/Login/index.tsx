import Footer from '@/components/Footer';
import { authControllerLoginBySso as login } from '@/services/tz-open-service/authControllerLoginBySso';
import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useModel, Helmet } from '@umijs/max';
import { Alert, message, Tabs, Divider, Space, theme } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { CSSProperties, useState } from 'react';
import { flushSync } from 'react-dom';
import styles from './index.less';
type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

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
  const [loginFormStatus, setLoginFormStatus] = useState({ message: '' });
  const [loginType, setLoginType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { token } = theme.useToken();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log(userInfo);
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginByPasswordDto) => {
    try {
      const data = await login({ ...values });
      if (data?.access_token) {
        message.success('登录成功！');
        localStorage.setItem('_token', data?.access_token);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      } else {
        setLoginFormStatus({
          message: '意料之外的错误，请联系管理员',
        });
      }
    } catch (e: any) {
      console.log(e);
      if (e?.response?.data?.message) {
        return setLoginFormStatus({
          message: e?.response?.data?.message,
        });
      }
      // 如果失败去设置用户错误信息
      setLoginFormStatus({
        message: '出错辣，请稍后再试',
      });
    }
  };

  return (
    <ProConfigProvider>
      <div
        style={{
          height: '100vh',
        }}
        className={styles.loginPage}
      >
        <Helmet>
          <title>登录页 - {Settings.title}</title>
        </Helmet>
        <LoginFormPage
          backgroundImageUrl="/images/5.jpg"
          // logo="/logo.png"
          logo="/logo_full.png"
          // title="天职国际"
          // subTitle="现 在 ，预 见 未 来"
          activityConfig={{ title: <img src="/images/slogan_white.png" alt="" width={360} /> }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginByPasswordDto);
          }}
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
                  <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
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
                  <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
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
                  <WeiboOutlined style={{ ...iconStyles, color: '#1890ff' }} />
                </div>
              </Space>
            </div>
          }
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
            <Tabs.TabPane key={'phone'} tab={'手机号登录'} />
          </Tabs>
          {loginFormStatus.message && <LoginMessage content={loginFormStatus.message} />}

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
                placeholder={'用户名: admin or user'}
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
                placeholder={'密码: ant.design'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          {loginType === 'phone' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <MobileOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                name="mobile"
                placeholder={'手机号'}
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
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
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'获取验证码'}`;
                  }
                  return '获取验证码';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
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
          <Footer style={{ color: 'white' }} />
        </div>
      </div>
    </ProConfigProvider>
  );
};

export default Login;
