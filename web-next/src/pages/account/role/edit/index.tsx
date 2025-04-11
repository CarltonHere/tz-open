import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  type ProFormInstance,
} from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';

import { permissionsControllerFindAllServices } from '@/services/swagger/permissions';
import {
  rolesControllerCreate,
  rolesControllerFindOne,
  rolesControllerUpdate,
} from '@/services/swagger/roles';
import { resolvePath, useAppData, useParams } from '@umijs/max';
import { notification } from 'antd';
import { filter, uniq } from 'lodash';
import PermissionCard from './components/PermissionCard';
import styles from './index.less';

function formatInterFaceRouteData(routesData: any[]) {
  const routefilter = filter(
    routesData,
    (item: any) => !item.parentId && item.layout !== false,
  ).map((item: any) => item.id);
  const routeGroups: {
    parent: any;
    children: any[];
    selectedCount: number;
  }[] = [];
  filter(routesData, (item: any) => routefilter.includes(item.parentId) && item.name)?.forEach(
    (parentNode: any) => {
      const routeGroup: any[] = [];
      function getDownNode(node: any) {
        if (node.id !== node.parentId) {
          const downNode = routesData.filter((item: any) => item.parentId === node.id && item.name);
          downNode.forEach((item: any) => {
            item.fullName = node.fullName ?? node.name + '.' + item.name;
            item.fullPath = resolvePath(item.path, node.fullPath ?? node.path).pathname;
            item.symbol = `${item.fullPath}|${item.method ?? 'GET'}`;
            routeGroup.push(item);
            getDownNode(item);
          });
        }
      }
      const rootNode = routesData.filter((node: any) => parentNode.id === node.id)[0];
      getDownNode(rootNode);
      routeGroups.push({
        parent: parentNode,
        children: routeGroup,
        selectedCount: 0,
      });
    },
  );

  return routeGroups;
}

function formatServiceRouteData(routesData: any[]) {
  const routeGroupsList: any = {};
  routesData
    .map((item) => {
      item.fullName = item.name;
      item.fullPath = item.path;
      item.symbol = `${item.fullPath}|${item.method}`;
      return item;
    })
    .forEach((service: any) => {
      routeGroupsList[service.group] = {
        children: [service, ...(routeGroupsList?.[service.group]?.children ?? [])],
      };
    });
  const routeGroupsArray = [];
  for (const parent in routeGroupsList) {
    if (routeGroupsList[parent]) {
      routeGroupsArray.push({
        parent: {
          name: parent,
        },
        children: routeGroupsList[parent].children,
      });
    }
  }

  return routeGroupsArray;
}

const RoleEditor: React.FC = () => {
  const params = useParams();
  const formRef = useRef<ProFormInstance>();
  // 获取并处理web路由数据
  const interfaceRoutes = filter(useAppData().routes);
  const interfaceRoutesData = formatInterFaceRouteData(interfaceRoutes);
  const [serviceRoutesData, setServiceRoutesData] = useState<any[]>([]);
  useEffect(() => {
    permissionsControllerFindAllServices().then((res) => {
      setServiceRoutesData(formatServiceRouteData(res.data));
    });
  }, []);
  return (
    <PageContainer>
      <ProCard
        style={{
          padding: 20,
        }}
        className={styles.ProcardReplace}
      >
        <StepsForm
          stepsProps={{
            direction: 'vertical',
            size: 'small',
          }}
          formRef={formRef}
          onFinish={async (values: any) => {
            const selectedInterfacePermissions = uniq(
              interfaceRoutesData?.reduce(
                (pre: any[], cur: any) => [
                  ...pre,
                  ...cur.children.filter((item: any) =>
                    Object.keys(values?.interface)?.includes?.(item.symbol),
                  ),
                ],
                [],
              ),
            );
            const selectedServicePermissions = uniq(
              serviceRoutesData?.reduce(
                (pre: any[], cur: any) => [
                  ...pre,
                  ...cur.children.filter((item: any) =>
                    Object.keys(values?.service)?.includes?.(item.symbol),
                  ),
                ],
                [],
              ),
            );

            const permissions: any[] = [];
            selectedInterfacePermissions?.forEach((item: any) => {
              permissions.push({
                type: '0',
                path: item.fullPath,
                method: item.method ?? 'GET',
                strategy: values?.interface?.[item.symbol] ?? '1',
              });
            });
            selectedServicePermissions?.forEach((item: any) => {
              permissions.push({
                type: '1',
                path: item.fullPath,
                method: item.method,
                strategy: values?.service?.[item.symbol] ?? '1',
              });
            });

            if (params?.id) {
              return rolesControllerUpdate(
                {
                  id: params.id,
                },
                {
                  name: values.name,
                  description: values.description,
                  permissions,
                },
              ).then((res) => {
                if (res.success) {
                  notification.success({
                    message: '保存成功',
                  });
                  history.back();
                }
              });
            }

            return rolesControllerCreate({
              name: values.name,
              description: values.description,
              permissions,
            }).then((res) => {
              if (res.success) {
                notification.success({
                  message: '创建成功',
                });
                history.back();
              }
            });
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
            request: async () => {
              if (params?.id) {
                return rolesControllerFindOne({
                  id: params.id,
                }).then((res) => {
                  const role = res.data;
                  role.interface = {};

                  role.permissions
                    ?.filter((item: any) => item.type === '0')
                    .forEach((item: any) => {
                      role.interface[`${item.path}|${item.method}`] = item.strategy;
                    });

                  role.service = {};
                  role.permissions
                    ?.filter((item: any) => item.type === '1')
                    .forEach((item: any) => {
                      role.service[`${item.path}|${item.method}`] = item.strategy;
                    });

                  return role;
                });
              }
              return {
                interface: interfaceRoutesData,
                service: serviceRoutesData,
              };
            },
          }}
        >
          <StepsForm.StepForm
            name="base"
            title="创建角色"
            stepProps={{
              description: '创建角色的基本信息',
            }}
          >
            <ProFormText
              name="name"
              label="角色名称"
              width="md"
              placeholder="请输入名称"
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="description"
              label="描述信息"
              width="lg"
              placeholder="选填，请输入描述信息"
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="step2"
            title="界面权限"
            stepProps={{
              description: '设置角色的界面访问权限',
            }}
            initialValues={{
              interface: {},
            }}
          >
            <ProForm.Item name="interface">
              <PermissionCard data={interfaceRoutesData}></PermissionCard>
            </ProForm.Item>
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="step3"
            title="服务权限"
            stepProps={{
              description: '设置角色的服务访问权限',
            }}
            initialValues={{
              service: {},
            }}
          >
            <ProForm.Item name="service">
              <PermissionCard data={serviceRoutesData}></PermissionCard>
            </ProForm.Item>
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  );
};

export default RoleEditor;
