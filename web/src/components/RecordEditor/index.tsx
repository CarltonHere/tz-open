import { BetaSchemaForm, ProFormColumnsType, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { Button } from 'antd';

const RecordEditor: React.FC<{
  columns: ProColumns<any, any>[];
  entity?: Record<string, any>;
  onFinish?: ((formData: any) => Promise<boolean | void>) & ((formData: any) => Promise<any>);
  trigger?: JSX.Element;
}> = (props) => {
  const [columns, setColumns] = useState<ProColumns<any, any>[]>([...props.columns]);
  const [initialValues, setInitialValues] = useState<Record<string, any>>({
    ...props.entity,
  });

  let needClose = true;
  useEffect(() => {
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
    setColumns([...columns]);
    setInitialValues({ ...props.entity });
  }, [props.columns]);
  return (
    <BetaSchemaForm
      key="recordEditor"
      title={initialValues.length > 0 ? '修改已有数据' : '添加新的数据'}
      initialValues={initialValues}
      layoutType="DrawerForm"
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
      width={'30vw'}
      {...props}
      columns={columns as ProFormColumnsType[]}
      onFinish={async (formData) => {
        if (props.onFinish) {
          return props.onFinish(formData)?.then(() => {
            let rtn = needClose;
            needClose = true;
            return rtn;
          });
        }
        needClose = true;
        return needClose;
      }}
    />
  );
};

export default RecordEditor;
