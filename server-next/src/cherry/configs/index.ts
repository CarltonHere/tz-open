export default function getConfigs(accessToken: string) {
  const config = {
    configId: 'b82f0666',
    update: {
      latestVersion: '1.5.6',
      lowestVersion: '1.5.6',
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
      topicNamingModel: {
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
              name: 'qwen-max-latest(旗舰文本但不会推理)',
              provider: 'bakertilly',
              group: '文本旗舰模型(目前效果最好的模型)',
              owned_by: 'system',
            },
            {
              id: 'qwen3-max-preview',
              name: 'qwen3-max-preview(下一代旗舰模型预览版)',
              provider: 'bakertilly',
              group: '文本旗舰模型(目前效果最好的模型)',
              owned_by: 'system',
            },
            {
              id: 'qwen-vl-plus',
              name: 'qwen-vl-plus(支持根据图片内容对话)',
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
          url: 'https://ai.tzcpa.com/chat/KfnSQiL3mJvyinVY',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/tzsw.png',
          type: 'Default',
        },
        {
          id: 'kjsy',
          name: '会计视界',
          url: 'https://ai.tzcpa.com/chat/hombXRzggzqZM4l8',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/kjwd.png',
          type: 'Default',
        },
        {
          id: 'yqzt',
          name: '舆情智探',
          url: 'https://ai.tzcpa.com/chat/agJ0fsCSRy1iVdmn',
          logo: 'https://open.tzcpa.com/com.tzcpa.cloud/static/icons/yqjk.png',
          type: 'Default',
        },
        {
          id: 'tzcs',
          name: '天职财思',
          url: 'https://ai.tzcpa.com/chat/d4OnWG66X4Fegakj',
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
      ],
      disabled: [],
      pinned: [],
    },
    mcp: {
      servers: [],
    },
  };
  return config;
}
