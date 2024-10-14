import { apiKeyControllerFindAll } from '@/services/tz-open-service/apiKeyControllerFindAll';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { Button, DatePicker, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import RecordEditor from '@/components/RecordEditor';
import { apiKeyControllerCreate } from '@/services/tz-open-service/apiKeyControllerCreate';
import { apiKeyControllerUpdate } from '@/services/tz-open-service/apiKeyControllerUpdate';
import { apiKeyControllerRemove } from '@/services/tz-open-service/apiKeyControllerRemove';

const ApiKey: React.FC = () => {
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '令牌',
      dataIndex: 'uuid',
      copyable: true,
      hideInForm: true,
      renderText(text) {
        return 'tzopen-' + text;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        '0': { text: '已启用', status: 'Success' },
        '1': { text: '已暂停', status: 'Warning' },
        '2': { text: '已禁用', status: 'Error' },
        '3': { text: '已失效', status: 'Default' },
      },
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
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInSearch: true,
      hideInForm: true,
      fixed: 'right',
      width: 100,
      render: (_, entity, __, action) => {
        return [
          <RecordEditor
            key="edit"
            entity={entity}
            trigger={<Button type="default" icon={<EditOutlined />} />}
            columns={columns}
            onFinish={async (params: any) => {
              return apiKeyControllerUpdate({ id: entity.id }, params).then(() => {
                message.success('修改成功');
                action?.reload();
                return true;
              });
            }}
          />,
          <Popconfirm
            key="delete"
            title="真的要删除这个项目么"
            description="该操作不可逆，请谨慎操作"
            onConfirm={() => {
              return apiKeyControllerRemove({ id: entity.id }).then(() => {
                message.success('删除成功');
                action?.reload();
              });
            }}
          >
            <Button danger type="default" icon={<DeleteOutlined />} />
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        request={(params) => apiKeyControllerFindAll({ params })}
        toolBarRender={(action) => [
          <RecordEditor
            key="create"
            trigger={
              <Button type="primary" icon={<EditOutlined />}>
                添加项目
              </Button>
            }
            columns={columns}
            onFinish={async (params: any) =>
              apiKeyControllerCreate(params).then(() => {
                message.success('添加成功');
                action?.reload();
                return true;
              })
            }
          />,
        ]}
      />
    </PageContainer>
  );
};

export default ApiKey;
