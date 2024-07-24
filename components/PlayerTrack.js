import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Entypo from 'react-native-vector-icons/Entypo';
import Slider from '@react-native-community/slider';
import {BottomModal} from 'react-native-modals';
import {ModalContent, ModalPortal} from 'react-native-modals';
import {Player} from '../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';

const PlayerTrack = ({}) => {
  const {
    currentTrack,
    setCurrentTrack,
    modalVisible,
    setModalVisible,
    currentSound,
    setCurrentSound,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    value,
    audioFiles,
    setAudioFiles,
    progressInterval,
    setProgressInterval,
  } = useContext(Player);
  const Play = async nextTrack => {
    setCurrentTrack(nextTrack);
    let preview_url;
    if (nextTrack?.track?.preview_url) {
      preview_url = nextTrack?.track?.preview_url;
    } else {
      preview_url = nextTrack?.url;
    }

    if (!preview_url) {
      setCurrentTime(0);
      console.error('No preview URL found for track:', nextTrack);
      return;
    }

    try {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (currentSound) {
        currentSound.pause();
      }

      // Create a new sound instance
      const sound = new Sound(preview_url, null, error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }

        setDuration(sound.getDuration());

        sound.play(success => {
          if (success) {
            console.log('Successfully finished playing');
            playNextTrack();
            clearInterval(progressInterval);
          } else {
            console.log('Playback failed due to audio decoding errors');
            clearInterval(progressInterval);
          }
          // Release the audio player resource
          sound.release();
          // setCurrentSound(null);
          // clearInterval(progressInterval);
        });
      });

      // Set the new sound instance
      setCurrentSound(sound);

      Sound.setCategory('Playback');
      setIsPlaying(true);

      // Set up a new interval to update the current time
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
      setCurrentTime(0);
      // clearInterval(progressInterval);
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
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const handleSeek = value => {
    if (currentSound) {
      currentSound.setCurrentTime(value);
      setCurrentTime(value);
    }
  };
  return (
    <>
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
          bottom: 40,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {currentTrack?.cover ? (
            <Image
              style={{width: 40, height: 40}}
              source={{uri: currentTrack?.cover}}
            />
          ) : currentTrack?.track?.album?.images[0].url ? (
            <Image
              style={{width: 40, height: 40}}
              source={{uri: currentTrack?.track?.album?.images[0].url}}
            />
          ) : (
            <Image
              source={require('./../assets/music-cover.jpg')}
              style={{width: 50, height: 50}}
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
            {currentTrack?.title
              ? currentTrack?.title
              : currentTrack?.track?.name}{' '}
            • {currentTrack?.track?.artists[0].name}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <AntDesign name="heart" size={24} color="#1DB954" />
          <Pressable>
            <AntDesign name="pausecircle" size={24} color="white" />
          </Pressable>
        </View>
      </Pressable>
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
              {currentTrack?.cover ? (
                <Image
                  style={{width: '100%', height: 330, borderRadius: 4}}
                  source={{uri: currentTrack?.cover}}
                />
              ) : currentTrack?.track?.album?.images[0].url ? (
                <Image
                  style={{width: '100%', height: 330, borderRadius: 4}}
                  source={{uri: currentTrack?.track?.album?.images[0].url}}
                />
              ) : (
                <Image
                  source={require('./../assets/music-cover.jpg')}
                  style={{width: '100%', height: 330, borderRadius: 4}}
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

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={currentTime}
                onValueChange={handleSeek}
              />
              <View
                style={{
                  marginTop: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: 'white', fontSize: 15, color: '#D3D3D3'}}>
                  {formatTime(currentTime)}
                </Text>

                <Text style={{color: 'white', fontSize: 15, color: '#D3D3D3'}}>
                  {formatTime(duration)}
                </Text>
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
                <Pressable onPress={() => playPreviousTrack(currentSound)}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={() => handlePlayPause(currentSound)}>
                  {isPlaying ? (
                    <AntDesign name="pausecircle" size={40} color="white" />
                  ) : (
                    <Pressable
                      onPress={() => handlePlayPause(currentSound)}
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
                <Pressable onPress={() => playNextTrack(currentSound)}>
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

export default PlayerTrack;

const styles = StyleSheet.create({});
// <Pressable
//   key={item.path}
//   onPress={() => Play(item)}
//   style={{
//     flexDirection: 'row',
//     gap: 5,
//     alignItems: 'center',
//     margin: 10,
//   }}>
//   {item.cover ? (
//     <Image
//       source={{uri: item.cover}}
//       style={{width: 50, height: 50}}
//     />
//   ) : (
//     <Image
//       source={require('./../assets/music-cover.jpg')}
//       style={{width: 50, height: 50}}
//     />
//   )}
//   <View style={{flex: 1}}>
//     <Text numberOfLines={1} style={{color: 'white'}}>
//       {item.title}
//     </Text>
//   </View>
//   <View style={{flexDirection: 'row', gap: 7}}>
//     <AntDesign name="heart" size={25} color={'#1DB954'} />
//     <Feather name="more-vertical" size={25} color="#c0c0c0" />
//   </View>
// </Pressable>
