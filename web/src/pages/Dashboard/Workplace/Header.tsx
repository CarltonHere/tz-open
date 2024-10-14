import { Avatar, Space, Statistic } from 'antd';
import React from 'react';
import { ProCard } from '@ant-design/pro-components';
const { Divider } = ProCard;

const Header: React.FC = () => {
  const currentUser = {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    name: '李垲熠',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '',
    group: '天职国际数字化运营部',
  };
  return (
    <ProCard.Group layout="center">
      <ProCard>
        <Space size="middle" align="center">
          <Avatar size={72} src={currentUser.avatar} />
          <Space direction="vertical">
            <div style={{ fontSize: '20px' }}>
              早安，
              {currentUser.name}
              ，祝你开心每一天！
            </div>
            <div style={{ fontSize: '14px', color: 'rgb(102, 102, 102)' }}>{currentUser.group}</div>
          </Space>
        </Space>
      </ProCard>
      <ProCard colSpan={'30%'}>
        <ProCard>
          <Statistic title="可用余额" value={79.0} precision={2} />
        </ProCard>
        <Divider type="vertical" />
        <ProCard>
          <Statistic title="可用余额" value={79.0} precision={2} />
        </ProCard>
      </ProCard>
    </ProCard.Group>
  );
};

export default Header;
