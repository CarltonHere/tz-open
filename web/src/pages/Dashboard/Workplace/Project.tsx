import { ProCard } from '@ant-design/pro-components';
import { Avatar, Space } from 'antd';
import React from 'react';

const Project: React.FC = () => {
  const allProject = [
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      name: '工商查询接口',
      describe: '海纳百川，有容乃大.那是一种内在的东西，他们到达不了，也无法触及的',
      provider: '天眼查',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      name: '工商查询接口',
      describe: '海纳百川，有容乃大.那是一种内在的东西，他们到达不了，也无法触及的',
      provider: '天眼查',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      name: '工商查询接口',
      describe: '海纳百川，有容乃大.那是一种内在的东西，他们到达不了，也无法触及的',
      provider: '天眼查',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      name: '工商查询接口',
      describe: '海纳百川，有容乃大.那是一种内在的东西，他们到达不了，也无法触及的',
      provider: '天眼查',
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      name: '工商查询接口',
      describe: '海纳百川，有容乃大.那是一种内在的东西，他们到达不了，也无法触及的',
      provider: '天眼查',
    },
  ];
  return (
    <ProCard gutter={[8, 8]} title="热门推荐" bordered headerBordered wrap>
      {allProject.map((item) => {
        return (
          <ProCard key="project" colSpan={8} bordered>
            <Space direction="vertical">
              <Space>
                <Avatar src={item.avatar} />
                <div style={{ font: '18px', fontWeight: 'bold' }}>{item.name}</div>
              </Space>
              <div style={{ color: '#666', margin: '6px auto', fontSize: '14px' }}>
                {item.describe}
              </div>
              <div style={{ color: '#999' }}>{item.provider}</div>
            </Space>
          </ProCard>
        );
      })}
    </ProCard>
  );
};

export default Project;
