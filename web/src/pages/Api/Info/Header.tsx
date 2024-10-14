import { Avatar, Space, Statistic } from 'antd';
import React from 'react';
import { ProCard } from '@ant-design/pro-components';
const { Divider } = ProCard;

const Header: React.FC = () => {
  const currentApp = {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    name: '天眼查',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '专业的工商信息整合商',
    describe: '天眼查官方服务接口演示描述，，，，，，',
    price: [
      {
        type: '按时计费',
        price: '1.00',
        suffix: '/30天',
      },
      {
        type: '按次计费',
        price: '1.00',
        suffix: '/千次',
      },
    ],
  };
  return (
    <ProCard.Group direction="row" layout="center">
      <ProCard>
        <Space size="middle" align="center">
          <Avatar size={72} src={currentApp.avatar} />
          <Space direction="vertical">
            <div style={{ fontSize: '20px' }}>
              {currentApp.name}-{currentApp.title}
            </div>
            <div style={{ fontSize: '14px', color: 'rgb(102, 102, 102)' }}>
              {currentApp.describe}
            </div>
          </Space>
        </Space>
      </ProCard>
      <ProCard colSpan={'40%'}>
        <ProCard>
          <Statistic
            title={currentApp.price[0].type}
            value={currentApp.price[0].price}
            suffix={currentApp.price[0].suffix}
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard>
          <Statistic
            title={currentApp.price[1].type}
            value={currentApp.price[1].price}
            suffix={currentApp.price[1].suffix}
          />
        </ProCard>
      </ProCard>
    </ProCard.Group>
  );
};

export default Header;
