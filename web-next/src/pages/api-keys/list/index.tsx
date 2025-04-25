import RecordEditor from '@/components/RecordEditor';
import {
  apiKeysControllerCreate,
  apiKeysControllerFindAll,
  apiKeysControllerRemove,
  apiKeysControllerUpdate,
} from '@/services/swagger/apiKeys';
import { usersControllerFindAll } from '@/services/swagger/users';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React from 'react';

const ApiKeysList: React.FC = () => {
  const columns: ProColumns<Record<string, any>, 'searchSelect'>[] = [
    { title: 'ID/Key', dataIndex: 'id', valueType: 'text', hideInForm: true },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '用户',
      dataIndex: ['owner', 'id'],
      valueType: 'searchSelect',
      render: (_, entity) => entity?.owner?.name,
      fieldProps: {
        searchRequest: usersControllerFindAll,
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        '0': {
          text: '启用',
          status: 'Success',
        },
        '1': {
          text: '禁用',
          status: 'Error',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
      // 可选参数
      formItemProps: {
        rules: [{ required: false }],
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInSearch: true,
      // 可选参数
      formItemProps: {
        rules: [{ required: false }],
      },
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInForm: true,
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
            entity={{
              ...entity,
              access_token: '不修改令牌',
            }}
            trigger={<Button type="default" icon={<EditOutlined />} />}
            columns={columns}
            onFinish={async (params: any) => {
              if (params.access_token === '不修改令牌') {
                delete params.access_token;
              }
              return apiKeysControllerUpdate({ id: entity.id }, params).then(() => {
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
            onConfirm={() =>
              apiKeysControllerRemove({
                id: entity.id,
              }).then(() => {
                message.success('删除成功');
                action?.reload();
              })
            }
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
        scroll={{ x: 'auto' }}
        rowKey={'id'}
        columns={columns}
        request={(params) => apiKeysControllerFindAll(params)}
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
              apiKeysControllerCreate(params).then(() => {
                message.success('添加成功');
                action?.reload();
                return true;
              })
            }
          />,
        ]}
      ></ProTable>
    </PageContainer>
  );
};

export default ApiKeysList;
