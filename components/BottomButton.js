import React from 'react';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { Button } from '@ui-kitten/components';

const BottomButton = ({ children, style, size, last = false, ...props }) => {
  let padding = 8;
  switch (size) {
    case 'giant':
      padding = 24;
      break;
    case 'large':
      padding = 16;
      break;
  }
  return (
    <SafeAreaConsumer>
      {(insets) => (
        <Button
          style={[
            {
              paddingBottom: (last ? insets.bottom : 0) + padding,
              paddingTop: padding,
              width: '100%',
              borderRadius: 0,
              borderWidth: 0,
            },
            style
          ]}
          size={size}
          {...props}
        >
          {children}
        </Button>
      )}
    </SafeAreaConsumer>
  );
}

export default BottomButton;