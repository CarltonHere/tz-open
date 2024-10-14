import { apiControllerFindAll } from '@/services/tz-open-service/apiControllerFindAll';
import { ProColumns, PageContainer, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import React from 'react';

const List: React.FC = () => {
  // 定义列配置
  const columns: ProColumns[] = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (dom, entity) => {
        return <Link to={`/api/info/${entity.id}`}>{dom}</Link>;
      },
    },
    {
      title: '描述',
      dataIndex: 'describe',
      width: 400,
      // ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '服务商',
      dataIndex: 'provider',
    },
    {
      title: '余额',
      dataIndex: 'balance',
    },
    {
      title: '操作',
      dataIndex: 'option',
    },
  ];
  return (
    <PageContainer>
      <ProTable
        rowKey={(record) => record.id}
        columns={columns}
        request={(params) => {
          return apiControllerFindAll(params);
        }}
      />
    </PageContainer>
  );
};

export default List;
