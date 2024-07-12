import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import {BottomModal} from 'react-native-modals';
import {Player} from '../App';
import {ModalContent, ModalPortal} from 'react-native-modals';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Linking} from 'react-native';
const SongInfoScreen = () => {
  const route = useRoute();
  const albumUrl = route?.params?.item?.track?.album?.uri;
  const [tracks, setTracks] = useState([]);
  const navigation = useNavigation();
  const albumId = albumUrl.split(':')[2];
  const [currentSound, setCurrentSound] = useState(null);
  const {currentTrack, setCurrentTrack} = useContext(Player);
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressInterval, setProgressInterval] = useState(null);
  const [duration, setDuration] = useState(0);
  const value = useRef(0);

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
  const playTrack = async () => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    }
    // await Play(tracks[0]);
    Linking.openURL(tracks[0].external_urls.spotify);
  };

  const Play = async nextTrack => {
    Linking.openURL(nextTrack.external_urls.spotify);
  };
  const handlePlayPause = () => {
    if (currentSound) {
      if (isPlaying) {
        currentSound.pause();
      } else {
        currentSound.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const playNextTrack = async () => {
    if (currentSound) {
      currentSound.pause();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      await Play(nextTrack);
    } else {
      value.current = 0;
      const nextTrack = savedTracks[0];
      setCurrentTrack(nextTrack);
      await Play(nextTrack);
    }
  };
  const playPreviousTrack = async () => {
    if (currentSound) {
      currentSound.pause();
      setCurrentSound(null);
    }

    value.current -= 1;
    if (value.current < savedTracks.length) {
      if (value.current < 0) {
        value.current = savedTracks.length - 1;
        const previousTrack = savedTracks[value.current];
        setCurrentTrack(previousTrack);
        await Play(previousTrack);
      } else {
        const previousTrack = savedTracks[value.current];
        setCurrentTrack(previousTrack);
        await Play(previousTrack);
      }
    }
  };
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
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
              onPress={playTrack}
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
                onPress={() => Play(track)}
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
      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: '#5072A7',
            width: '90%',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 15,
            position: 'absolute',
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Image
              style={{width: 40, height: 40}}
              source={{uri: currentTrack?.track?.album?.images[0].url}}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: 'white',
                fontWeight: 'bold',
              }}>
              {currentTrack?.track?.name} •{' '}
              {currentTrack?.track?.artists[0].name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <AntDesign name="heart" size={24} color="#1DB954" />
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}
      <BottomModal
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(false)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}>
        <ModalContent
          style={{height: '100%', width: '100%', backgroundColor: '#5072A7'}}>
          <View style={{height: '100%', width: '100%', marginTop: 40}}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Pressable onPress={() => setModalVisible(false)}>
                <AntDesign name="down" size={24} color="white" />
              </Pressable>

              <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white'}}>
                {currentTrack?.track?.name}
              </Text>
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>
            <View style={{height: 70}} />
            <View style={{padding: 10}}>
              <Image
                style={{width: '100%', height: 330, borderRadius: 4}}
                source={{uri: currentTrack?.track?.album?.images[0]?.url}}
              />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                    {currentTrack?.track?.name}
                  </Text>
                  <Text style={{color: '#D3D3D3', marginTop: 4}}>
                    {currentTrack?.track?.artists[0].name}
                  </Text>
                </View>

                <AntDesign name="heart" size={24} color="#1DB954" />
              </View>
              <View style={{marginTop: 10}}>
                <View
                  style={{
                    width: '100%',
                    marginTop: 10,
                    height: 3,
                    backgroundColor: 'gray',
                    borderRadius: 5,
                  }}>
                  <View
                    style={[
                      styles.progressbar,
                      {width: `${(currentTime / duration) * 100}%`},
                    ]}
                  />
                  <View
                    style={[
                      {
                        position: 'absolute',
                        top: -5,
                        width: 12,
                        height: 12,
                        borderRadius: 12 / 2,
                        backgroundColor: 'white',
                      },
                      {
                        left: `${(currentTime / duration) * 100}%`,
                        marginLeft: -12 / 2,
                      },
                    ]}
                  />
                </View>
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 15, color: '#D3D3D3'}}>
                    {formatTime(currentTime)}
                  </Text>

                  <Text
                    style={{color: 'white', fontSize: 15, color: '#D3D3D3'}}>
                    {formatTime(duration)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 17,
                }}>
                <Pressable>
                  <FontAwesome name="arrows" size={30} color="#03C03C" />
                </Pressable>
                <Pressable onPress={playPreviousTrack}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={handlePlayPause}>
                  {isPlaying ? (
                    <AntDesign name="pausecircle" size={40} color="white" />
                  ) : (
                    <Pressable
                      onPress={handlePlayPause}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Entypo
                        name="controller-play"
                        size={26}
                        color="#03C03C"
                      />
                    </Pressable>
                  )}
                </Pressable>
                <Pressable onPress={playNextTrack}>
                  <Ionicons name="play-skip-forward" size={30} color="white" />
                </Pressable>
                <Pressable>
                  <Feather name="repeat" size={30} color="#03C03C" />
                </Pressable>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

export default SongInfoScreen;

const styles = StyleSheet.create({});
