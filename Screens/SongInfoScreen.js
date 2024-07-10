import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
const SongInfoScreen = () => {
  const route = useRoute();
  const albumUrl = route?.params?.item?.track?.album?.uri;
  const [tracks, setTracks] = useState([]);
  const navigation = useNavigation();
  const albumId = albumUrl.split(':')[2];
  useEffect(() => {
    async function fetchSongs() {
      const accessToken = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('failed to fetch album songs');
        }

        const data = await response.json();
        const tracks = data.items;
        setTracks(tracks);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchSongs();
  }, []);
  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <ScrollView style={{marginTop: 30}}>
        <View style={{flexDirection: 'row', padding: 12}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image
              style={{width: 200, height: 200}}
              source={{uri: route?.params?.item?.track?.album?.images[0].url}}
            />
          </View>
        </View>
        <Text
          style={{
            color: 'white',
            marginHorizontal: 12,
            marginTop: 10,
            fontSize: 22,
            fontWeight: 'bold',
          }}>
          {route?.params?.item?.track?.name}
        </Text>
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: 10,
            gap: 7,
          }}>
          {route?.params?.item?.track?.artists?.map((item, index) => (
            <Text
              style={{color: '#909090', fontSize: 13, fontWeight: '500'}}
              key={index}>
              {item.name}
            </Text>
          ))}
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <Pressable
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: '#1DB954',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="arrowdown" size={20} color="white" />
          </Pressable>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <MaterialCommunityIcons
              name="cross-bolnisi"
              size={24}
              color="#1DB954"
            />
            <Pressable
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1DB954',
              }}>
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
        <View>
          <View style={{marginTop: 10, marginHorizontal: 12}}>
            {tracks?.map((track, index) => (
              <Pressable
                key={index}
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{fontSize: 16, fontWeight: '500', color: 'white'}}>
                    {track?.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 5,
                    }}>
                    {track?.artists?.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: 'gray',
                        }}>
                        {item?.name}
                      </Text>
                    ))}
                  </View>
                </View>
                <Entypo name="dots-three-vertical" size={24} color="white" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SongInfoScreen;

const styles = StyleSheet.create({});
