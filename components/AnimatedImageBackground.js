import React, { useState, useEffect } from 'react';

import { Animated, Image, View } from 'react-native';

const BACKGROUND_IMAGE_OPACITY = 0.08;
const BACKGROUND_IMAGE_INTERVAL = 10000;

const AnimatedImageBackground = ({ onLoadEnd, backgroundColor, images = [], children }) => {
  const [ index, setIndex ] = useState(0);
  const [ imageLoaded, setImageLoaded ] = useState(false);

  const [ imageBackgroundOpacity, setImageBackgroundOpacity ] = useState(new Animated.Value(0));
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(imageBackgroundOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIndex((index + 1) % images.length);

        Animated.timing(imageBackgroundOpacity, {
          toValue: BACKGROUND_IMAGE_OPACITY,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      })
    }, BACKGROUND_IMAGE_INTERVAL);

    return () => {
      clearTimeout(timer);
    }
  }, [images, index]);

  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(imageBackgroundOpacity, {
        toValue: BACKGROUND_IMAGE_OPACITY,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [imageLoaded]);

  return (
    <React.Fragment>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor,
        }}
      />
      <Animated.Image
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: imageBackgroundOpacity,
        }}
        source={
          images[index] ? { uri: images[index] } : {}
        }
        onLoadEnd={() => {
          setImageLoaded(true);
          onLoadEnd();
        }}
      />
      {children}
    </React.Fragment>
  );
}

export default AnimatedImageBackground;
