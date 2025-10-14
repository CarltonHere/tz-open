export default function getConfigs(accessToken: string) {
  const config = {
    configId: 'b82f0665',
    update: {
      latestVersion: '1.6.3',
      lowestVersion: '1.5.1',
      storeUrl: 'http://appstore.tzcpa.com/appDetail?appId=67',
    },
    llm: {
      // 默认模型配置
      defaultModel: {
        id: 'qwen-max-latest',
        name: 'qwen-max-latest',
        provider: 'bakertilly',
        group: 'qwen-max',
        owned_by: 'system',
      },
      quickModel: {
        id: 'qwen-turbo-latest',
        name: 'qwen-turbo-latest',
        provider: 'bakertilly',
        group: 'qwen-turbo',
        owned_by: 'system',
      },
      translateModel: {
        id: 'qwen-max-latest',
        name: 'qwen-max-latest',
        provider: 'bakertilly',
        group: 'qwen-max',
        owned_by: 'system',
      },
      topicNamingModel: {
        id: 'qwen-turbo-latest',
        name: 'qwen-turbo-latest',
        provider: 'bakertilly',
        group: 'qwen-turbo',
        owned_by: 'system',
      },
      quickAssistantModel: {
        id: 'qwen-max-latest',
        name: 'qwen-max-latest',
        provider: 'bakertilly',
        group: 'qwen-max',
        owned_by: 'system',
      },
      // 模型配置参数
      providers: [
        {
          id: 'bakertilly',
          name: '天职国际',
          type: 'openai',
          apiKey: accessToken,
          apiHost: 'https://api.tzcpa.com/origin/bailian/compatible-mode/v1/',
          models: [
            {
              id: 'qwen-turbo-latest',
              name: 'qwen-turbo-latest(超快&长文本)',
              provider: 'bakertilly',
              group: '文本轻量模型(速度快、更长的文本长度)',
              owned_by: 'system',
            },
            {
              id: 'qwen-plus-latest',
              name: 'qwen-plus-latest(均衡文本)',
              provider: 'bakertilly',
              group: '文本均衡模型(聊天&思考融合模型)',
              owned_by: 'system',
            },
            {
              id: 'qwen-max-latest',
              name: 'qwen-max-latest(第二代旗舰模型但不会推理)',
              provider: 'bakertilly',
              group: '文本旗舰模型(目前效果最好的模型)',
              owned_by: 'system',
            },
            {
              id: 'qwen3-max',
              name: 'qwen3-max(第三代旗舰模型)',
              provider: 'bakertilly',
              group: '文本旗舰模型(目前效果最好的模型)',
              owned_by: 'system',
            },
            {
              id: 'qwen-long',
              name: 'qwen-long(长文档阅读模型支持图片PDF)',
              provider: 'bakertilly',
              group: '长文本阅读模型(支持超长文本和多格式文档)',
              owned_by: 'system',
            },
            {
              id: 'qwen3-vl-plus',
              name: 'qwen3-vl-plus(支持根据图片内容对话)',
              provider: 'bakertilly',
              group: '视觉模型(支持识别图片中的文字等内容)',
              owned_by: 'system',
            },
            {
              id: 'qwen-coder-plus',
              name: 'qwen-coder-plus(代码专长)',
              provider: 'bakertilly',
              group: '代码模型(擅长代码处理)',
              owned_by: 'system',
            },
            {
              id: 'gte-rerank-v2',
              name: 'gte-rerank-v2',
              provider: 'bakertilly',
              group: '重排模型',
              owned_by: 'system',
            },
            {
              id: 'text-embedding-v1',
              name: 'text-embedding-v1',
              provider: 'bakertilly',
              group: '嵌入模型',
              owned_by: 'system',
            },
            {
              id: 'text-embedding-v2',
              name: 'text-embedding-v2',
              provider: 'bakertilly',
              group: '嵌入模型',
              owned_by: 'system',
            },
            {
              id: 'text-embedding-v3',
              name: 'text-embedding-v3',
              provider: 'bakertilly',
              group: '嵌入模型',
              owned_by: 'system',
            },
            {
              id: 'text-embedding-v4',
              name: 'text-embedding-v4',
              provider: 'bakertilly',
              group: '嵌入模型',
              owned_by: 'system',
            },
            {
              id: 'qwen3-235b-a22b',
              name: 'qwen3-235b-a22b(旗舰开源)',
              provider: 'bakertilly',
              group: '开源版多专家模型',
              owned_by: 'system',
            },
            {
              id: 'qwen3-30b-a3b',
              name: 'qwen3-30b-a3b(开源小钢炮)',
              provider: 'bakertilly',
              group: '开源版多专家模型',
              owned_by: 'system',
            },
            {
              id: 'deepseek-r1',
              name: 'deepseek-r1',
              provider: 'bakertilly',
              group: 'DeepSeek',
              owned_by: 'system',
            },
            {
              id: 'deepseek-v3',
              name: 'deepseek-v3',
              provider: 'bakertilly',
              group: 'DeepSeek',
              owned_by: 'system',
            },
            {
              id: 'deepseek-v3.1',
              name: 'deepseek-v3.1',
              provider: 'bakertilly',
              group: 'DeepSeek',
              owned_by: 'system',
              capabilities: [
                {
                  type: 'function_calling',
                },
                {
                  type: 'reasoning',
                  isUserSelected: true,
                },
              ],
            },
          ],
          isSystem: true,
          enabled: true,
        },
      ],
    },

    minapps: {
      enabled: [
        {
          id: 'tzws',
          name: '天职问税',
          url: 'https://zh.tzcpa.com/chat/UXwjAmcqsQf6WNlR',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/tzsw.png',
          type: 'Default',
        },
        {
          id: 'kjsy',
          name: '会计视界',
          url: 'https://zh.tzcpa.com/chat/cE9uUw8Vdwv0z2VX',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/kjwd.png',
          type: 'Default',
        },
        {
          id: 'yqzt',
          name: '舆情智探',
          url: 'https://zh.tzcpa.com/chat/C4rwqOdAp928Mcxh',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/yqjk.png',
          type: 'Default',
        },
        {
          id: 'tzcs',
          name: '天职财思',
          url: 'https://zh.tzcpa.com/chat/fhMtFCemWVluurc8',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/bbfx.png',
          type: 'Default',
        },
        {
          id: 'bxfxal',
          name: '保险风险案例',
          url: 'https://ai.tzcpa.com/chat/aRbjGXLWRNCZaWf3',
          logo: '/src/assets/images/logo.png',
          type: 'Default',
        },
        {
          id: 'hyzy',
          name: '行业智研',
          url: 'http://10.16.8.65:32717/reports/2025/0630/index_20250630.html',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/hyzy.png',
          type: 'Default',
        },
        {
          id: 'nkzsfxkz',
          name: '内控矩阵检查',
          url: 'https://zh.tzcpa.com/chat/8YSRxHzJDLswddX4',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/nkzs.png',
          type: 'Default',
        },
        {
          id: 'nkzsdgdj',
          name: '内控底稿搭建',
          url: 'https://zh.tzcpa.com/chat/zmumlOlAUpJ08nvO',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/nkzs.png',
          type: 'Default',
        },
      ],
      disabled: [],
      pinned: [],
    },
    mcp: {
      servers: [
        {
          name: 'AntV画图助手',
          type: 'sse',
          description:
            '基于AntV图表封装的MCP插件，支持通过MCP工具创建思维导图、流程图等15+常用可视化图表。',
          isActive: true,
          provider: 'BakerTilly',
          tags: [],
          baseUrl:
            'https://api.tzcpa.com/open/amcp/antv-visualization-chart/sse',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ],
    },
    idp: {
      providers: [
        {
          id: 'mineru',
          name: '天职IDP',
          apiKey: 'AAAAA',
          apiHost: 'http://8.130.181.29:8000',
        },
      ],
      defaultProvider: 'mineru',
    },
  };
  return config;
}
