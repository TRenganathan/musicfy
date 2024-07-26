import React, {memo, useContext} from 'react';
import {Pressable, Image, Text, View, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {Player} from '../App';

const RenderItem = memo(({item, onPress}) => {
  const {currentTrack} = useContext(Player);

  return (
    <Pressable onPress={onPress} style={styles.itemContainer}>
      {item.cover ? (
        <Image source={{uri: item.cover}} style={styles.image} />
      ) : (
        <Image
          source={require('./../assets/music-cover.jpg')}
          style={styles.image}
        />
      )}
      <View style={{flex: 1}}>
        <Text
          numberOfLines={1}
          style={[
            styles.text,
            currentTrack?.title === item?.title && styles.currentTrackText,
          ]}>
          {item.title}
        </Text>
      </View>
      <View style={styles.iconsContainer}>
        <AntDesign name="heart" size={25} color={'#1DB954'} />
        <Feather name="more-vertical" size={25} color="#c0c0c0" />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  text: {
    color: 'white',
  },
  currentTrackText: {
    color: 'green',
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 7,
  },
});

export default RenderItem;
