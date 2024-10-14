import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import styles from './index.less';

const Footer: React.FC<{ style?: React.CSSProperties }> = (props) => {
  const defaultMessage = '天职国际数字化运营部出品';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      className={styles.footer}
      style={
        {
          background: 'none',
          '--copyright-color': 'none',
          ...props.style,
        } as React.CSSProperties
      }
      copyright={`${currentYear} ${defaultMessage}`}
    />
  );
};

export default Footer;
