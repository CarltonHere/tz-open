import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { authControllerFindAll } from '@/services/tz-open-service/authControllerFindAll';
import { DatePicker } from 'antd';

const ApiKey: React.FC = () => {
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '方式',
      dataIndex: 'method',
    },
    {
      title: '操作',
      dataIndex: 'type',
    },
    {
      title: '结果',
      dataIndex: 'status',
      valueEnum: {
        '0': { text: '成功', status: 'Success' },
        '1': { text: '失败', status: 'Error' },
        '2': { text: '拦截', status: 'Warning' },
        '3': { text: '无效', status: 'Default' },
      },
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '时间',
      valueType: 'dateTime',
      dataIndex: 'create_time',
      hideInForm: true,
      renderFormItem: () => <DatePicker.RangePicker showTime />,
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        request={(params) => authControllerFindAll({ params })}
      />
    </PageContainer>
  );
};

export default ApiKey;
