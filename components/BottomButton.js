import React from 'react';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { Button } from '@ui-kitten/components';

const BottomButton = ({ children, ...props }) => {
  return (
    <SafeAreaConsumer>
      {(insets) => (
        <Button
          style={{
            paddingBottom: insets.bottom + 24,
            paddingTop: 24,
            width: '100%',
            borderRadius: 0,
          }}
          size="giant"
          {...props}
        >
          {children}
        </Button>
      )}
    </SafeAreaConsumer>
  );
}

export default BottomButton;