import { rolesControllerFindAll, rolesControllerRemove } from '@/services/swagger/roles';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React from 'react';

const RoleList: React.FC = () => {
  const columns: ProColumns<Record<string, any>>[] = [
    { title: 'ID', dataIndex: 'id', valueType: 'text' },
    {
      title: '标题',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
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
          <Button key="edit" type="default" icon={<EditOutlined />} href={'edit/' + entity.id} />,
          <Popconfirm
            key="delete"
            title="真的要删除这个项目么"
            description="该操作不可逆，请谨慎操作"
            onConfirm={() =>
              rolesControllerRemove({
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
        request={(params) => rolesControllerFindAll(params)}
        toolBarRender={() => [
          <Button key="create" type="primary" icon={<EditOutlined />} href="create">
            添加项目
          </Button>,
        ]}
      ></ProTable>
    </PageContainer>
  );
};

export default RoleList;
