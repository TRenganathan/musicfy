import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState();
  const [playlists, setPlaylists] = useState([]);
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
  const getPlayList = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error retrieving playlists:', error);
    }
  };
  useEffect(() => {
    getProfile();
    getPlayList();
  }, []);
  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <ScrollView style={{marginTop: 50}}>
        <View style={{padding: 12}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                resizeMode: 'cover',
                objectFit: 'contain',
              }}
              source={{uri: userProfile?.images[0].url}}
            />
            <View>
              <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                {userProfile?.display_name}
              </Text>
              <View style={{flexDirection: 'row', gap: 5}}>
                <Text style={{color: 'gray', fontSize: 15, fontWeight: 'bold'}}>
                  {userProfile?.followers?.total}
                </Text>
                <Text style={{color: 'gray', fontSize: 15, fontWeight: 'bold'}}>
                  followers
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: '500',
            marginHorizontal: 12,
          }}>
          Your Playlists
        </Text>
        <View style={{padding: 15}}>
          {playlists.map((item, index) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginVertical: 10,
              }}
              key={index}>
              <Image
                source={{
                  uri:
                    item?.images[0]?.url ||
                    'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800',
                }}
                style={{width: 50, height: 50, borderRadius: 4}}
              />
              <View>
                <Text style={{color: 'white'}}>{item?.name}</Text>
                <Text style={{color: 'white', marginTop: 7}}>0 followers</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Text>ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
