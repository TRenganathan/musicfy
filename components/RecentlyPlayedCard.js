import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const RecentlyPlayedCard = ({item, index}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('Info', {
          item: item,
        })
      }
      style={{margin: 10}}>
      {item?.track?.album?.images[0]?.url && (
        <Image
          style={{width: 130, height: 130, borderRadius: 5}}
          source={{uri: item.track.album.images[0].url}}
        />
      )}
      {/* <Text
        numberOfLines={1}
        style={{
          fontSize: 13,
          fontWeight: '500',
          color: 'white',
          marginTop: 10,
        }}>
        {item?.track?.name}
      </Text> */}
      <Text>
        {(item?.track?.name).length > 18
          ? (item?.track?.name).substring(0, 18 - 3) + '...'
          : item?.track?.name}
      </Text>
    </Pressable>
  );
};

export default RecentlyPlayedCard;

const styles = StyleSheet.create({});
