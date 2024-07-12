import {StyleSheet, Text, View, Image, Linking, Pressable} from 'react-native';
import React from 'react';

const ArtistCard = ({item}) => {
  const LinkToSpotify = () => {
    Linking.openURL(item.external_urls.spotify);
  };
  return (
    <View style={{margin: 10}}>
      <Pressable onPress={() => LinkToSpotify(item)}>
        <Image
          style={{width: 130, height: 130, borderRadius: 5}}
          source={{uri: item.images[0].url}}
        />
        <Text
          style={{
            fontSize: 13,
            fontWeight: '500',
            color: 'white',
            marginTop: 10,
          }}>
          {item?.name}
        </Text>
      </Pressable>
    </View>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({});
