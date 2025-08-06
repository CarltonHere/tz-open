import { BetaSchemaForm, ProColumns, ProFormColumnsType } from '@ant-design/pro-components';
import { Button } from 'antd';
import _ from 'lodash';
import React from 'react';
const RecordEditor: React.FC<{
  columns: ProColumns<any, any>[];
  entity?: Record<string, any>;
  onFinish?: ((formData: any) => Promise<boolean | void>) & ((formData: any) => Promise<any>);
  trigger?: JSX.Element;
}> = (props) => {
  const columns = props.columns.map((column: any) => {
    if (typeof column.formItemProps?.rules !== 'undefined') {
      const hasRequired = _.some(column.formItemProps?.rules, (rule) => {
        if (typeof rule.required !== 'undefined') {
          return true;
        }
        return false;
      });
      if (!hasRequired) {
        column.formItemProps.rules.push({ required: true, message: '此项为必填项' });
      }
    } else {
      column.formItemProps = {
        rules: [{ required: true, message: '此项为必填项' }],
      };
    }
    column.width = column.width || 'lg';
    column.colProps = column.colProps || {
      span: 6,
    };
    return column;
  });
  return (
    <BetaSchemaForm
      title={props.entity ? '修改已有数据' : '添加新的数据'}
      initialValues={props.entity}
      // layoutType={
      //   columns.filter((column) => !column.hideInForm).length > 3 ? 'DrawerForm' : 'ModalForm'
      // }
      // shouldUpdate={true}
      layoutType="ModalForm"
      modalProps={{
        // destroyOnClose: true,
        forceRender: true,
      }}
      rowProps={{
        gutter: [8, 8],
      }}
      grid
      trigger={props.trigger}
      submitter={{
        render: (renderProps, doms) => {
          return [
            <Button key="restBtn" onClick={() => renderProps.form?.resetFields()}>
              重置
            </Button>,
            ...doms,
          ];
        },
      }}
      // {...props}
      columns={columns as ProFormColumnsType[]}
      onFinish={async (formData) => props.onFinish?.(formData)}
    />
  );
};

export default RecordEditor;
