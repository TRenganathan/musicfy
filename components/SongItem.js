import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {Player} from '../App';
const SongItem = ({item, onPress, isPlaying}) => {
  const {currentTrack, setCurrentTrack} = useContext(Player);
  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item);
  };

  return (
    <Pressable
      style={{flexDirection: 'row', padding: 10}}
      onPress={handlePress}>
      {item?.track?.album?.images[0].url && (
        <Image
          style={{width: 50, height: 50, marginRight: 10}}
          source={{uri: item?.track?.album?.images[0].url}}
        />
      )}
      <View style={{flex: 1}}>
        <Text
          numberOfLines={1}
          style={
            isPlaying
              ? {
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: '#3FFF00',
                }
              : {fontWeight: 'bold', fontSize: 14, color: 'white'}
          }>
          {item?.track?.name}
        </Text>
        <View style={{flexDirection: 'row', gap: 5}}>
          <Text style={{marginTop: 4, color: '#989898'}}>
            {item?.track?.artists[0]?.name}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: 7}}>
        <AntDesign name="heart" size={25} color={'#1DB954'} />
        <Feather name="more-vertical" size={25} color="#c0c0c0" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({});
