import React from 'react';
import {
  Avatar,
  Icon,
  withStyles
} from '@ui-kitten/components';
import { View, Text, TouchableOpacity } from 'react-native';
import DefaultAvatar from '../assets/default-avatar.png';

const UserAvatar = ({ user, size, borderWidth = 0, editable, ...props }) => {
  const style = {
    container: {
      borderRadius: (size + borderWidth * 2) / 2,
      overflow: 'hidden',
      width: size + borderWidth * 2,
      height: size + borderWidth * 2,
      borderWidth: borderWidth,
      borderColor: 'white',
    },
    avatar: {
      width: size,
      height: size,
      borderRadius: 0,
      zIndex: 1,
    },
    editContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: size,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      height: size / 3.5,
      zIndex: 2,
    },
  };

  return (
    <TouchableOpacity
      style={style.container}
      disabled={!editable}
      onPress={() => {

      }}
    >
      <Avatar
        style={style.avatar}
        source={{ uri: `https://api.adorable.io/avatars/${size}/${user.id}` }}
        {...props}
      />
      {
        editable ? (
          <View
            style={style.editContainer}
          >
            <Icon width={size / 6} height={size / 6} fill="white" name="edit-outline" />
          </View>
        ) : null
      }
    </TouchableOpacity>
  );
}

export default UserAvatar;