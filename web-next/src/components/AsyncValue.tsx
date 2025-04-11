import React, { useEffect, useState } from 'react';

const AsyncValue: React.FC<{
  request: () => Promise<any>;
}> = (props) => {
  const [value, setValue] = useState('loading...');
  console.log('AsyncValue', props?.request);
  useEffect(() => {
    props?.request?.().then((text) => {
      setValue(text);
    });
  }, [props]);
  return <>{value ? value : '-'}</>;
};

export default AsyncValue;
