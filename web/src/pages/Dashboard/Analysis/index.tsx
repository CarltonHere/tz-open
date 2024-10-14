import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import { request } from '@umijs/max';
import Pie from './Pie';

const { Divider } = ProCard;

const Billing: React.FC = () => {
  const [lineData, setLineData] = useState([]);

  const fetchLineData = () => {
    request('/api/billing')
      .then((response) => response.data)
      .then((json) => setLineData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  useEffect(() => {
    fetchLineData();
  }, []);
  const lineConfig = {
    data: lineData,
    xField: 'Date',
    yField: 'scales',
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0.1,
      end: 0.5,
    },
  };
  return (
    <PageContainer>
      <ProCard
        title="数据概览"
        extra={new Date().toLocaleDateString()}
        split={'horizontal'}
        headerBordered
        bordered
      >
        <ProCard.Group title="核心指标" direction={'row'}>
          <ProCard>
            <Statistic title="可用余额" value={79.0} precision={2} />
          </ProCard>
          <Divider type="vertical" />
          <ProCard>
            <Statistic title="冻结金额" value={112893.0} precision={2} />
          </ProCard>
          <Divider type="vertical" />
          <ProCard>
            <Statistic title="已开通接口" value={93} suffix="/ 100" />
          </ProCard>
          <Divider type="vertical" />
          <ProCard>
            <Statistic title="冻结金额" value={112893.0} />
          </ProCard>
        </ProCard.Group>
        <ProCard split={'vertical'} headerBordered bordered>
          <ProCard split="horizontal">
            <ProCard split="horizontal">
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    title: '昨日全部流量',
                    value: 234,
                    description: <Statistic title="较本月平均流量" value="8.04%" trend="down" />,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '本月累计流量',
                    value: 234,
                    description: <Statistic title="月同比" value="8.04%" trend="up" />,
                  }}
                />
              </ProCard>
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    title: '运行中实验',
                    value: '12/56',
                    suffix: '个',
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '历史实验总数',
                    value: '134',
                    suffix: '个',
                  }}
                />
              </ProCard>
            </ProCard>
            <StatisticCard title="流量走势" chart={<Line {...lineConfig}></Line>} />
          </ProCard>
          <StatisticCard title="流量占用情况" chart={<Pie />} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Billing;
