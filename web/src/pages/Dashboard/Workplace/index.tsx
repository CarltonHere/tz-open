import React from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import Header from './Header';
import Project from './Project';

const Workplace: React.FC = () => {
  return (
    <PageContainer>
      <Header></Header>
      <ProCard style={{ marginBlockStart: 8 }} ghost>
        <ProCard colSpan={'70%'} ghost style={{ marginBlockStart: 6, paddingInlineEnd: 16 }}>
          <Project></Project>
        </ProCard>
        <ProCard colSpan={'30%'} ghost gutter={[0, 12]} direction="column">
          <ProCard
            title="最新更新"
            bordered
            headerBordered
            direction="column"
            gutter={[0, 8]}
            collapsible
          >
            <ProCard hoverable bordered>
              购买地址
            </ProCard>
            <ProCard hoverable bordered>
              使用说明下载
            </ProCard>
            <ProCard hoverable bordered>
              工具包下载
            </ProCard>
          </ProCard>
          <ProCard
            title="公告通知"
            bordered
            headerBordered
            direction="column"
            gutter={[0, 12]}
            collapsible
          >
            <ProCard bordered>
              <p style={{ fontWeight: 'bold' }}>Q1:XXXXXXXXXXXXX</p>
              <p>A1:XXXXXXXXXXXX</p>
            </ProCard>
            <ProCard bordered>
              <p style={{ fontWeight: 'bold' }}>Q1:XXXXXXXXXXXXX</p>
              <p>A1:XXXXXXXXXXXX</p>
            </ProCard>
            <ProCard bordered>
              <p style={{ fontWeight: 'bold' }}>Q1:XXXXXXXXXXXXX</p>
              <p>A1:XXXXXXXXXXXX</p>
            </ProCard>
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Workplace;
