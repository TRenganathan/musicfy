/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useState} from 'react';

import Navigation from './StackNavigator';
import {ModalPortal} from 'react-native-modals';
export const Player = createContext();
function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  return (
    <Player.Provider value={{currentTrack, setCurrentTrack}}>
      <Navigation />
      <ModalPortal />
    </Player.Provider>
  );
}

export default App;
