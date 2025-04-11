import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { message } from 'antd';
import { useEffect, useState } from 'react';

interface FormProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  'aria-invalid'?: boolean;
}

const WangEditor: React.FC<FormProps> = (props) => {
  let isReady = false;

  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: '/api/resource',
        maxFileSize: 2 * 1024 * 1024,
        fieldName: 'file',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Authentication')}`,
        },
        customInsert(res: any, insertFn: any) {
          insertFn(`/api/resource/${res.data.id}`);
        },
        // 上传错误，或者触发 timeout 超时
        onError(file: File, err: any, res: any) {
          // TS 语法
          // onError(file, err, res) {               // JS 语法
          console.log(`${file.name} 上传出错`, err, res);
          message.error(`上传图片出错，${err.message}`);
        },
      },
      uploadVideo: {
        server: '/api/resource',
        maxFileSize: 20 * 1024 * 1024,
        fieldName: 'file',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Authentication')}`,
        },
        customInsert(res: any, insertFn: any) {
          insertFn(`/api/resource/${res.data.id}`);
        },
        // 上传错误，或者触发 timeout 超时
        onError(file: File, err: any, res: any) {
          // TS 语法
          // onError(file, err, res) {               // JS 语法
          console.log(`${file.name} 上传出错`, err, res);
          message.error(`上传视频出错，${err.message}`);
        },
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  return (
    <div
      id={props.id}
      style={
        props['aria-invalid']
          ? { border: '1px solid red', zIndex: 100 }
          : { border: '1px solid #ccc', zIndex: 100 }
      }
    >
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={props.value}
        onCreated={setEditor}
        onChange={(editor) => {
          let editorHtml = editor.getHtml();
          if (editorHtml === '<p><br></p>') {
            editorHtml = '';
          }
          if (isReady === false && editorHtml === '') {
            isReady = true;
            return;
          }
          isReady = true;

          props.onChange?.(editorHtml);
        }}
        mode="default"
        style={{ height: '500px', overflowY: 'hidden' }}
      />
    </div>
  );
};

export default WangEditor;
