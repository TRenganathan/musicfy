/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useEffect, useRef, useState} from 'react';

import Navigation from './StackNavigator';
import {ModalPortal} from 'react-native-modals';
import MusicControl from 'react-native-music-control';
import Sound from 'react-native-sound';
import {AppState} from 'react-native';
export const Player = createContext();
function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const [progressInterval, setProgressInterval] = useState(null);
  const value = useRef(0);
  //
  useEffect(() => {
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);

    MusicControl.on('play', onPlay);
    MusicControl.on('pause', onPause);
    MusicControl.on('nextTrack', onNextTrack);
    MusicControl.on('previousTrack', onPreviousTrack);

    return () => {
      console.log(AppState, 'State');
      MusicControl.stopControl();
    };
  }, [currentSound]);

  const onPlay = () => {
    if (currentSound) {
      currentSound.play();
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING,
      });
    }
  };

  const onPause = () => {
    if (currentSound) {
      currentSound.pause();
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PAUSED,
      });
    }
  };

  const onNextTrack = () => {
    playNextTrack();
  };

  const onPreviousTrack = () => {
    playPreviousTrack();
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
  //
  console.log(AppState, 'State');
  return (
    <Player.Provider
      value={{
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
      }}>
      <Navigation />
      <ModalPortal />
    </Player.Provider>
  );
}

export default App;
