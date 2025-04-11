import { EditOutlined } from '@ant-design/icons';
import { ModalForm, ProCard, ProForm } from '@ant-design/pro-components';
import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import PermissionTransfer from './PermissionTransfer';

const PermissionCard: React.FC<{
  data: any[];
  onChange?: (value: Record<string, any>) => void;
  value?: Record<string, any>;
}> = (props) => {
  const [selectedRoutes, setSelectedRoutes] = useState<Record<string, any>>(props.value ?? {});
  const [selectedCountList, setSelectedCountList] = useState<any[]>([]);
  useEffect(() => {
    // 计算已选择数量
    setSelectedCountList(
      props?.data?.map(
        (group) =>
          group.children.filter((item: any) => Object.keys(selectedRoutes).includes(item.symbol))
            .length,
      ),
    );
    // 获取已选择的route
    props.onChange?.(selectedRoutes);
  }, [selectedRoutes, props?.data]);

  return (
    <ProCard size="small" ghost gutter={[16, 16]} wrap title="权限服务">
      {props?.data?.map((group, index) => {
        return (
          <ProCard key={`permission-${group.parent.name}`} colSpan={'200px'} bordered>
            <Typography
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography.Text strong>
                {group.parent.name
                  ? `${group.parent.name.charAt(0).toUpperCase()}${group.parent.name.slice(1)}`
                  : group.parent.path}
              </Typography.Text>
              {/* <Switch
                size="small"
                checked={selectedCountList?.[index] > 0}
                onClick={(checked) => {
                  if (checked) {
                    setSelectedRoutes(
                      uniq([...group.children.map((item: any) => item.symbol), ...selectedRoutes]),
                    );
                  } else {
                    const unSelectedItems = group.children.map((item: any) => item.symbol);
                    setSelectedRoutes(
                      selectedRoutes.filter((item) => !unSelectedItems.includes(item)),
                    );
                  }
                }}
              ></Switch> */}
            </Typography>
            <Typography
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography.Text>
                已启用权限
                <Typography.Text type="secondary" style={{ marginLeft: 6 }}>
                  ({selectedCountList?.[index] ?? 0}/{group.children.length})
                </Typography.Text>
              </Typography.Text>
              <ModalForm
                onFinish={async (values) => {
                  setSelectedRoutes(values.permission);
                  console.log(values);
                  return true;
                }}
                width={'fit-content'}
                title="编辑权限"
                trigger={<EditOutlined />}
                modalProps={{
                  destroyOnClose: true,
                }}
                initialValues={{
                  permission: props?.value,
                }}
              >
                <ProForm.Item name="permission">
                  <PermissionTransfer
                    disabled={false}
                    dataSource={group.children}
                  ></PermissionTransfer>
                </ProForm.Item>
              </ModalForm>
            </Typography>
          </ProCard>
        );
      })}
    </ProCard>
  );
};

export default PermissionCard;
