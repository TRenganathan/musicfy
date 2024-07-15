import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  Alert,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  getAll,
  SortSongFields,
  SortSongOrder,
} from 'react-native-get-music-files';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';
import {BottomModal} from 'react-native-modals';
import {ModalContent, ModalPortal} from 'react-native-modals';
import {Player} from '../App';
const LocalMusicPlayer = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [input, setIput] = useState('');
  const {currentTrack, setCurrentTrack} = useContext(Player);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchedTracks, setSearchedTracks] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [progressInterval, setProgressInterval] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const value = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to read audio files',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');

        getAllLocalSongs();
        // _getSongs();
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const Play = async nextTrack => {
    setCurrentTrack(nextTrack);
    const preview_url = nextTrack?.url;
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

      Sound.setCategory('Playback');
      setIsPlaying(true);
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
  const getAllLocalSongs = async () => {
    const songsOrError = await getAll({
      limit: 100,

      offset: 0,
      cover: true,
      coverQuality: 50,

      minSongDuration: 1000,
      sortBy: SortSongFields.TITLE,
      sortOrder: SortSongOrder.DESC,
    }).then(res => {
      setAudioFiles(res);
    });
  };
  const handleSearch = text => {
    setIput(text);
    const filteredTracks = audioFiles?.filter(item =>
      item.title.toLowerCase().includes(text.toLocaleLowerCase()),
    );
    setSearchedTracks(filteredTracks);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const playTrack = async () => {
    if (audioFiles.length > 0) {
      setCurrentTrack(audioFiles[0]);
    }
    await Play(audioFiles[0]);
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
    if (value.current < audioFiles.length) {
      const nextTrack = audioFiles[value.current];
      setCurrentTrack(nextTrack);
      await Play(nextTrack);
    } else {
      value.current = 0;
      const nextTrack = audioFiles[0];
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
    if (value.current < audioFiles.length) {
      if (value.current < 0) {
        value.current = audioFiles.length - 1;
        const previousTrack = audioFiles[value.current];
        setCurrentTrack(previousTrack);
        await Play(previousTrack);
      } else {
        const previousTrack = audioFiles[value.current];
        setCurrentTrack(previousTrack);
        await Play(previousTrack);
      }
    }
  };
  return (
    <LinearGradient
      colors={['#510d55', '#180310']}
      style={{flex: 1, padding: 10}}>
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

      <View
        style={{
          marginHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <View>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
            Local Songs
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 13,
              marginTop: 5,
              marginBottom: 10,
            }}>
            {audioFiles?.length ? audioFiles?.length : 0}
          </Text>
        </View>

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
      </View>
      <FlatList
        data={audioFiles}
        keyExtractor={item => item.path}
        renderItem={({item}) => (
          <Pressable
            key={item.id}
            onPress={() => Play(item)}
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              margin: 10,
            }}>
            {item.cover ? (
              <Image
                source={{uri: item.cover}}
                style={{width: 50, height: 50}}
              />
            ) : (
              <Image
                source={require('./../assets/music-cover.jpg')}
                style={{width: 50, height: 50}}
              />
            )}
            <View style={{flex: 1}}>
              <Text numberOfLines={1} style={{color: 'white'}}>
                {item.title}
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 7}}>
              <AntDesign name="heart" size={25} color={'#1DB954'} />
              <Feather name="more-vertical" size={25} color="#c0c0c0" />
            </View>
          </Pressable>
        )}
      />
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
            {currentTrack?.cover && (
              <Image
                style={{width: 40, height: 40}}
                source={{uri: currentTrack?.cover}}
              />
            )}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: 'white',
                fontWeight: 'bold',
              }}>
              {currentTrack?.title} • {currentTrack?.track?.artists[0].name}
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
                {currentTrack?.title}
              </Text>
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>
            <View style={{height: 70}} />
            <View style={{padding: 10}}>
              {currentTrack?.cover && (
                <Image
                  style={{width: '100%', height: 330, borderRadius: 4}}
                  source={{uri: currentTrack?.cover}}
                />
              )}
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
    </LinearGradient>
  );
};

export default LocalMusicPlayer;
const styles = StyleSheet.create({
  progressbar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
