import { PageContainer, ProCard } from '@ant-design/pro-components';
import React from 'react';
import Header from './Header';
import { useParams } from '@umijs/max';

const Info: React.FC = () => {
  const appId = useParams().id;
  console.log(appId);
  const article = {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    name: '工商查询接口',
    describe: '海纳百川，有容乃大.那是一种内在的东西，他们到达不了，也无法触及的',
    provider: '天眼查',
    content:
      '<p><span class="ql-size-large" style="color: rgb(102, 102, 102); background-color: rgb(252, 252, 252);">360文件夹是一款单窗口多标签的资源管理器，提高了用户使用各类文件夹操作效率。单窗口多标签，像浏览器一样用多标签管理每个文件夹，以便更加快速高效的切换文件夹，告别凌乱的窗口，加快办公效率；添加书签，快速访问常用文件夹， 根据工作需要，灵活管理常用文件，收藏常用文件到书签，一键到达指定位置；文件、网页搜索，更迅速的文件、网页快捷搜索，内置Everything搜索引擎，查找文件更快速，瞬间找到想要的文件，让搜索无需等待。</span></p><p><br></p><p><span class="ql-size-large">介绍视频：</span></p><p><br></p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="//player.bilibili.com/player.html?aid=426849514&amp;bvid=BV1P3411V7h8&amp;cid=727876396&amp;page=1" height="450px" width="100%"></iframe><p><br></p><p><strong class="ql-size-large">【360文件】是一款单窗口多标签的资源管理器，提高了使用各类文件夹操作效率。</strong></p><p><br></p><p><span class="ql-size-large">【单窗口多标签】</span></p><p><span class="ql-size-large">像浏览器一样用多标签管理每个文件夹，以便更加快速高效的切换文件夹，告别凌乱的窗口，加快办公效率</span></p><p><br></p><p><span class="ql-size-large">【添加书签】</span></p><p><span class="ql-size-large">快速访问常用文件夹， 根据工作需要，灵活管理常用文件，收藏常用文件到书签，一键到达指定位置</span></p><p><br></p><p><span class="ql-size-large">使用说明</span></p><p><br></p><p><span class="ql-size-large">【新建标签页】</span></p><p><span class="ql-size-large">用户双击任意文件夹，或者在已激活主窗口点击+按钮，或在原有标签上右键新建标签页，即可。</span></p><p><span class="ql-size-large">鼠标右键标签页，支持多项新建、复制、关闭其他标签等操作</span></p><p><br></p><p><span class="ql-size-large">【书签栏】</span></p><p><span class="ql-size-large">可拖动文档、软件、文件夹到此，点击快速打开</span></p><p><span class="ql-size-large">右键收藏书签，支持打开所在位置、置顶等操作</span></p><p><br></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">【常用查看设置】</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">点击工具栏【查看】下拉窗口可选择文件展现方式及预览、文件属性相关设定</span></p><p><br></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">【快捷键】</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">双击标签栏可以关闭当前标签</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">使用 Alt + 左右箭头快捷前进/后退目录</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">Ctrl+W关闭当前标签</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">Ctrl+T新建标签</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">Ctrl+N 创建新窗口页面</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">Ctrl+Tab 切换到下一个标签页</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">Ctrl+Shitf+Tab 切换到上一个标签页</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">Alt+enter&nbsp;&nbsp;打开文件属性</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">Ctrl + Shift + N – 创建一个新文件夹</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">支持鼠标中键点击标签页关闭</span></p><p><span class="ql-size-large" style="color: rgb(67, 74, 84);">查看方式支持按住Ctrl+滚轮调节 等等....</span></p>',
  };
  return (
    <PageContainer>
      <Header></Header>
      <ProCard style={{ marginBlockStart: 8 }} ghost>
        <ProCard colSpan={'70%'} ghost style={{ paddingInlineEnd: 16 }} gutter={[0, 12]}>
          <ProCard title="接口介绍" bordered headerBordered>
            <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
          </ProCard>
        </ProCard>
        <ProCard colSpan={'30%'} ghost gutter={[0, 12]} direction="column">
          <ProCard
            title="快速导航"
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
            title="Q&A"
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

export default Info;
