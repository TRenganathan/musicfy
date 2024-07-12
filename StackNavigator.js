import {View, Text, Linking, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './Screens/ProfileScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import LoginScreen from './Screens/LoginScreen';
import LikedSongsScreen from './Screens/LikedSongsScreen';
import SongInfoScreen from './Screens/SongInfoScreen';
import PlayListScreen from './Screens/PlayListScreen';

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowOpacity: 4,
          shadowRadius: 4,
          elevation: 4,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarLabelStyle: {color: 'white'},
          tabBarIcon: focused =>
            focused ? (
              <FontAwesome name="home" size={25} color="white" />
            ) : (
              <AntDesign name="home" size={25} color="white" />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {color: 'white'},
          tabBarIcon: focused =>
            focused ? (
              <Ionicons name="person" size={25} color="white" />
            ) : (
              <Ionicons
                name="person-outline
"
                color="white"
                size={25}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Liked"
          component={LikedSongsScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#614385',
            },
            headerTitleStyle: {color: 'white'},

            headerTintColor: 'white',
          }}
        />
        <Stack.Screen name="Info" component={SongInfoScreen} />
        <Stack.Screen
          name="PlayList"
          component={PlayListScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#9b6078',
            },
            headerTitleStyle: {color: 'white'},

            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Navigation;
