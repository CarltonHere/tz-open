import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Flex, Select, Table, Tag, Transfer, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyles = createStyles(() => {
  return {
    TransferStyleCoverage: {
      "[class^='ant-transfer-list-header-selected']": {
        width: '100%',
      },
      "[class*='ant-transfer-list']": {
        // flex: 'auto',
        "[class*='ant-table-content']": {
          maxHeight: '50vh',
          overflow: 'auto !important',
        },
      },
      "[class*='ant-transfer-list-header']": {
        flex: 'none',
      },
    },
  };
});

const PermissionTransfer: React.FC<{
  dataSource: any[];
  disabled?: boolean;
  onChange?: (nextValues: Record<string, any>) => void;
  value?: Record<string, any>;
}> = (props) => {
  let _data: Record<string, any> = {};
  props.dataSource.forEach((item: any) => {
    _data[item.symbol] = '1';
  });

  _data = {
    ..._data,
    ...props?.value,
  };

  const { styles } = useStyles();

  const currentTransferedKeys = props.dataSource
    .filter((item) => Object.keys(props?.value ?? {}).includes(item.symbol))
    .map((item) => item.symbol);

  const otherTransferedKeys = Object.keys(props?.value ?? {}).filter(
    (item) => !currentTransferedKeys.includes(item),
  );

  const columns: ProColumns<Record<string, any>>[] = [
    {
      dataIndex: 'fullName',
      title: 'Name',
    },
    {
      dataIndex: 'method',
      title: 'Method',
      render: (_, entity) => (
        <Tag style={{ marginInlineEnd: 0 }} color="cyan">
          {entity.method ?? 'GET'}
        </Tag>
      ),
    },
    {
      dataIndex: 'fullPath',
      title: 'Path',
    },
    {
      title: 'Strategy',
      key: 'strategy',
      // editable: true,
      // valueType: 'select',
      // valueEnum: { 1: 'GET', 2: 'POST', 3: 'PUT', 4: 'DELETE' },
      render: (_, entity) => (
        <Select
          defaultValue={_data[entity.symbol]}
          style={{ width: '100%' }}
          onChange={(value) => {
            _data[entity.symbol] = value;
            const selectedKeys = [...currentTransferedKeys, ...otherTransferedKeys];
            const nextValues: Record<string, any> = {};
            for (let k in _data) {
              if (_data[k]) {
                if (selectedKeys.includes(k)) {
                  nextValues[k] = _data[k];
                }
              }
            }
            props?.onChange?.(nextValues);
          }}
          options={[
            { value: '0', label: 'Global' },
            { value: '1', label: 'Personal' },
          ]}
        />
      ),
    },
  ];

  return (
    <Transfer
      dataSource={props.dataSource}
      targetKeys={currentTransferedKeys}
      disabled={props.disabled}
      // showSearch
      rowKey={(record) => record.symbol}
      showSelectAll={false}
      onChange={(nextTargetKeys) => {
        const selectedKeys = [...nextTargetKeys, ...otherTransferedKeys];
        const nextValues: Record<string, any> = {};
        for (let k in _data) {
          if (_data[k]) {
            if (selectedKeys.includes(k)) {
              nextValues[k] = _data[k];
            }
          }
        }
        props?.onChange?.(nextValues);
      }}
      className={styles.TransferStyleCoverage}
      selectAllLabels={[
        ({ totalCount }) => (
          <Flex justify="space-between" style={{ width: '100%' }}>
            <Typography.Text>未启用权限</Typography.Text>
            <Typography.Text>{`${totalCount}/${props.dataSource.length}项`}</Typography.Text>
          </Flex>
        ),
        ({ totalCount }) => (
          <Flex justify="space-between" style={{ width: '100%' }}>
            <Typography.Text>已启用权限</Typography.Text>
            <Typography.Text>{`${totalCount}/${props.dataSource.length}项`}</Typography.Text>
          </Flex>
        ),
      ]}
    >
      {({
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const rowSelection = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys: any[]) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys ?? [],
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
        };

        return (
          <ProTable
            scroll={{ x: 'auto' }}
            search={false}
            options={false}
            rowKey={(record) => record.symbol}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: (e) => {
                if (
                  itemDisabled ||
                  listDisabled ||
                  (e?.target as any)?.className?.includes?.('ant-select')
                ) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

export default PermissionTransfer;
