import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import {Player} from '../App';
import LinearGradient from 'react-native-linear-gradient';
const PlayListScreen = () => {
  const route = useRoute();
  const playList = route?.params?.item;

  const [inputValue, setInputValue] = useState('');
  const [userProfile, setUserProfile] = useState();
  const [playListTracks, setPlayListTracks] = useState([]);
  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseText = await response.text();

      if (response.ok) {
        const profile = JSON.parse(responseText);

        setUserProfile(profile);
        // Do something with the profile data
      } else {
        console.error('Error fetching profile:', responseText);
        Alert.alert('Error', 'Failed to fetch profile');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('expirationDate');
        navigation.navigate('Login');
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getProfile();
    getPlayListTracks();
  }, []);
  // console.log(playList, 'plylist');

  const getPlayListTracks = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      if (!accessToken) {
        console.log('Access token not found');
        return;
      }
      const type = 'artists';
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/4a0f58fygnj7AtQ7hozKXe/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setPlayListTracks(response.data.items);
    } catch (err) {
      console.log(err.message);
    }
  };

  const [isPlaying, setIsplaying] = useState(false);
  const handlePress = item => {
    Linking.openURL(item?.track?.external_urls?.spotify);
  };

  // console.log(playListTracks[0]?.track?.album?.images[0].url, 'Playlist track');
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={{flex: 1, padding: 10}}>
      <ScrollView style={{height: 100, marginTop: 30}}>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              backgroundColor: '#3b5998',
              paddingVertical: 5,
              paddingHorizontal: 10,
              flex: 1,
              borderRadius: 5,
            }}>
            <AntDesign name="search1" color="white" size={20} />
            <TextInput
              value={inputValue}
              onChangeText={text => setInputValue(text)}
              style={{height: 40, padding: 10}}
              placeholder="search"
              placeholderTextColor={'white'}
            />
          </Pressable>

          <Pressable
            style={{
              height: 40,
              backgroundColor: '#3b5998',
              display: 'flex',
              justifyContent: 'center',
              paddingHorizontal: 20,
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <View>
              <Text style={{color: 'white'}}>sort</Text>
            </View>
          </Pressable>
        </Pressable>
        <View style={{marginTop: 50}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
          {playList.images[0].url && (
            <Image
              style={{height: 250, width: 250}}
              source={{uri: playList.images[0].url}}
            />
          )}
        </View>
        <Text
          style={{
            fontSize: 23,
            marginTop: 20,
            fontWeight: 'bold',
            fontFamily: 'Popins',
            color: 'white',
          }}>
          {playList?.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 15,
          }}>
          {userProfile?.images[0].url && (
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                resizeMode: 'cover',
                objectFit: 'contain',
              }}
              source={{uri: userProfile?.images[0].url}}
            />
          )}
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Popins',
              }}>
              {userProfile?.display_name}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 2, marginTop: 12}}>
          <Feather name="globe" size={25} color="#a5a5a5" />
          <Text style={{color: '#a5a5a5', fontSize: 15, fontFamily: 'Popins'}}>
            {' '}
            1 Like .{' '}
          </Text>
          <Text style={{color: '#a5a5a5', fontSize: 15, fontFamily: 'Popins'}}>
            {playList?.tracks?.total} songs
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            <Text
              style={{
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 12,
                padding: 3,
                paddingHorizontal: 12,
              }}>
              Enhance
            </Text>
            <Feather name="arrow-down-circle" size={27} color="#a5a5a5" />
            <AntDesign name="adduser" size={27} color="#a5a5a5" />
            <Entypo name="dots-three-vertical" size={27} color="#a5a5a5" />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            <FontAwesome6
              name="arrow-right-arrow-left"
              size={25}
              color="#a5a5a5"
            />
            <Pressable
              // onPress={playTrack}
              style={{
                width: 50,
                height: 50,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1DB954',
              }}>
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            display: 'flex',
            width: 'max-content',
            marginTop: 20,
          }}>
          <Text
            style={{
              borderWidth: 2,
              borderColor: 'gray',
              borderRadius: 12,
              padding: 3,
              paddingHorizontal: 12,
              textAlign: 'center',
            }}>
            add Songs
          </Text>
        </Pressable>
        <View>
          {playListTracks.map((item, i) => (
            <View key={i}>
              <Pressable
                style={{flexDirection: 'row', padding: 10}}
                onPress={() => handlePress(item)}>
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
                  {/* <AntDesign name="heart" size={25} color={'#1DB954'} /> */}
                  <Feather name="more-vertical" size={25} color="#c0c0c0" />
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PlayListScreen;

const styles = StyleSheet.create({});
