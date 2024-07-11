import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongItem from '../components/SongItem';
import {Player} from '../App';

//
import {BottomModal} from 'react-native-modals';
import {ModalContent, ModalPortal} from 'react-native-modals';
import Sound from 'react-native-sound';

const LikedSongsScreen = () => {
  const {currentTrack, setCurrentTrack} = useContext(Player);
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [input, setIput] = useState('');
  const [savedTracks, setSavedTracks] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [progressInterval, setProgressInterval] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const value = useRef(0);

  const [searchedTracks, setSearchedTracks] = useState([]);
  useEffect(() => {
    // Cleanup when component unmounts or sound changes
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (currentSound) {
        currentSound.release();
      }
    };
  }, [currentSound, progressInterval]);

  async function getSavedTracks() {
    try {
      const accessToken = await AsyncStorage.getItem('token');

      const response = await fetch(
        'https://api.spotify.com/v1/me/tracks?offset=0&limit=50',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('failed to fetch the tracks');
      }
      const data = await response.json();
      setSavedTracks(data.items);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getSavedTracks();
  }, []);
  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
    }
    await Play(savedTracks[0]);
  };
  const Play = async nextTrack => {
    const preview_url = nextTrack?.track?.preview_url;
    if (!preview_url) {
      console.error('No preview URL found for track:', nextTrack);
      return;
    }
    try {
      if (currentSound) {
        currentSound.pause();
      }
      const sound = new Sound(preview_url, null, error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }

        setDuration(sound.getDuration());

        sound.play(success => {
          if (success) {
            console.log('Successfully finished playing');
            setCurrentSound(null);
            playNextTrack();
            clearInterval(progressInterval);
          } else {
            console.log('Playback failed due to audio decoding errors');
            clearInterval(progressInterval);
          }
          // Release the audio player resource
          sound.release();
        });
      });
      setCurrentSound(sound);
      // Optionally set audio mode (this may not be needed depending on your requirements)
      Sound.setCategory('Playback');
      setIsPlaying(sound?._loaded);

      const interval = setInterval(() => {
        if (sound) {
          sound.getCurrentTime(seconds => setCurrentTime(seconds));
        }
      }, 1000);
      setProgressInterval(interval);
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
  const handleSearch = text => {
    setIput(text);
    const filteredTracks = savedTracks?.filter(item =>
      item.track.name.toLowerCase().includes(text.toLocaleLowerCase()),
    );
    setSearchedTracks(filteredTracks);
  };

  /******************************************************************************************/
  // const [tracks, setTracks] = useState([]);
  // const fetchSongs = async () => {
  //   try {
  //     await fetch(
  //       'https://api.jamendo.com/v3.0/tracks/?client_id=e0ab303f&format=jsonpretty&name=mocking',
  //     )
  //       .then(response => response.json())
  //       .then(data => {
  //         console.log(data, 'JAMENDO API');
  //         setTracks(data.results);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchSongs();
  // }, []);
  /******************************************************************************************/

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <View style={{flex: 1, marginTop: 10}}>
          <Pressable
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 9,
            }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#42275a',
                padding: 9,
                flex: 1,
                borderRadius: 3,
                height: 38,
              }}>
              <AntDesign name="search1" color="white" size={20} />
              <TextInput
                value={input}
                onChangeText={text => handleSearch(text)}
                placeholder="find liked songs"
                placeholderTextColor={'gray'}
                style={{fontWeight: '500', color: 'white', height: 90}}
              />
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 10,
                backgroundColor: '#42275a',
                padding: 10,
                borderRadius: 3,
                height: 38,
              }}>
              <Text style={{color: 'white'}}>Sort</Text>
            </Pressable>
          </Pressable>
          <View style={{height: 50}} />
          <View style={{marginHorizontal: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
              Liked Songs
            </Text>
            <Text style={{color: 'white', fontSize: 13, marginTop: 5}}>
              {savedTracks?.length ? savedTracks?.length : 0}
            </Text>
          </View>
          <Pressable
            style={{
              marginTop: 20,
              marginHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Pressable
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1DB954',
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
          </Pressable>

          <View>
            {searchedTracks.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={searchedTracks}
                renderItem={({item}) => (
                  <SongItem
                    item={item}
                    onPress={() => Play(item)}
                    isPlaying={item === currentTrack}
                  />
                )}
              />
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={savedTracks}
                renderItem={({item}) => (
                  <SongItem
                    item={item}
                    onPress={() => Play(item)}
                    isPlaying={item === currentTrack}
                  />
                )}
              />
            )}
          </View>
        </View>
      </View>
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
    </>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
