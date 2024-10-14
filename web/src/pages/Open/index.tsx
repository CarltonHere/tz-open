import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { DatePicker } from 'antd';
import { openControllerFindAll } from '@/services/tz-open-service/openControllerFindAll';

const ApiKey: React.FC = () => {
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '接口',
      dataIndex: 'path',
    },
    {
      title: '请求次数',
      dataIndex: 'count',
    },
    {
      title: '计费次数',
      dataIndex: 'billCount',
    },
    {
      title: '费用',
      dataIndex: 'cost',
      valueType: 'money',
    },
    {
      title: '创建时间',
      valueType: 'dateTime',
      dataIndex: 'create_time',
      hideInForm: true,
      renderFormItem: () => <DatePicker.RangePicker showTime />,
    },
    {
      title: '修改时间',
      valueType: 'dateTime',
      dataIndex: 'update_time',
      hideInForm: true,
      renderFormItem: () => <DatePicker.RangePicker showTime />,
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        request={(params) => openControllerFindAll({ params })}
      />
    </PageContainer>
  );
};

export default ApiKey;
