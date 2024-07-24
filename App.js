/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useRef, useState} from 'react';

import Navigation from './StackNavigator';
import {ModalPortal} from 'react-native-modals';
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
