import RecordEditor from '@/components/RecordEditor';
import { rolesControllerFindAll } from '@/services/swagger/roles';
import {
  usersControllerCreate,
  usersControllerFindAll,
  usersControllerRemove,
  usersControllerUpdate,
} from '@/services/swagger/users';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React from 'react';

const RoleList: React.FC = () => {
  const columns: ProColumns<Record<string, any>, 'searchSelect'>[] = [
    { title: 'ID', dataIndex: 'id', valueType: 'text', hideInForm: true },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'password',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'text',
      // 可选参数
      formItemProps: {
        rules: [{ required: false }],
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
      title: '角色',
      dataIndex: ['role', 'id'],
      valueType: 'searchSelect',
      render: (_, entity) => entity?.role?.name,
      fieldProps: {
        searchRequest: rolesControllerFindAll,
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
              password: '不修改密码',
            }}
            trigger={<Button type="default" icon={<EditOutlined />} />}
            columns={columns}
            onFinish={async (params: any) => {
              if (params.password === '不修改密码') {
                delete params.password;
              }
              return usersControllerUpdate({ id: entity.id }, params).then(() => {
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
              usersControllerRemove({
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
        request={(params) => usersControllerFindAll(params)}
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
              usersControllerCreate(params).then(() => {
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

export default RoleList;
