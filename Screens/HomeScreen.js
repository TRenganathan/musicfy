import {
  Alert,
  Button,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ArtistCard from '../components/ArtistCard';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import PlayerTrack from '../components/PlayerTrack';
import {Player} from '../App';

const HomeScreen = () => {
  const {currentTrack} = useContext(Player);

  const [userProfile, setUserProfile] = useState();
  const navigation = useNavigation();
  const [recentlyplayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [playLists, setPlayList] = useState([]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return 'Good Morning';
    } else if (currentTime < 16) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  const message = greetingMessage();
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
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/recently-played?limit=10',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data.items;

      setRecentlyPlayed(tracks);
    } catch (err) {
      console.log(err.message);
    }
  };
  const getTopItems = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      if (!accessToken) {
        console.log('Access token not found');
        return;
      }
      const type = 'artists';
      const response = await axios.get(
        `https://api.spotify.com/v1/me/top/${type}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setTopArtists(response.data.items);
    } catch (err) {
      console.log(err.message);
    }
  };
  const getPlayList = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      if (!accessToken) {
        console.log('Access token not found');
        return;
      }
      const type = 'artists';
      const response = await axios.get(
        `https://api.spotify.com/v1/me/playlists`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setPlayList(response.data.items);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProfile();
    getRecentlyPlayedSongs();
    getTopItems();
    getPlayList();
  }, []);
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('expirationDate');
    navigation.navigate('Login');
  };
  const NavigateToPlayList = item => {
    navigation.navigate('PlayList', {item: item});
  };
  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => NavigateToPlayList(item)}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: '#282828',
          borderRadius: 4,
          elevation: 3,
        }}>
        <Image
          style={{height: 55, width: 55}}
          source={{uri: item?.images[0]?.url}}
        />
        <View style={{flex: 1, marginHorizontal: 8, justifyContent: 'center'}}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {item?.name}
          </Text>
          <Text style={{color: '#989898', marginTop: 3, fontSize: 12}}>
            {item.tracks.total} Songs
          </Text>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={{backgroundColor: '#131624', flex: 1}}>
      <ScrollView style={{marginTop: 50}}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {userProfile?.images[0]?.url && (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  resizeMode: 'cover',
                }}
                source={{uri: userProfile?.images[0]?.url}}
              />
            )}
            <View>
              <Text style={{fontSize: 12, marginLeft: 10}}>
                {userProfile?.display_name}
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {message}
              </Text>
            </View>
          </View>

          {/* <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color="white"
          /> */}
          <Button title="logout" onPress={logout} />
        </View>
        <View
          style={{
            marginHorizontal: 12,
            marginVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Pressable
            style={{
              backgroundColor: '#282828',
              padding: 10,
              borderRadius: 30,
            }}>
            <Text style={{fontSize: 15, color: 'white'}}>Music</Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: '#282828',
              padding: 10,
              borderRadius: 30,
            }}>
            <Text style={{fontSize: 15, color: 'white'}}>Podcasts & Shows</Text>
          </Pressable>
        </View>
        <View style={{height: 10}} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable
            onPress={() => navigation.navigate('Liked')}
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: '#202020',
              borderRadius: 4,
              elevation: 3,
            }}>
            <View style={{backgroundColor: '#33006F'}}>
              <Pressable
                style={{
                  width: 55,
                  height: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="heart" size={24} color="white" />
              </Pressable>
            </View>

            <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}>
              Liked Songs
            </Text>
          </Pressable>

          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: '#202020',
              borderRadius: 4,
              elevation: 3,
            }}>
            <Image
              style={{width: 55, height: 55}}
              source={{uri: 'https://i.pravatar.cc/100'}}
            />
            <View style={styles.randomArtist}>
              <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}>
                Hiphop Tamhiza
              </Text>
            </View>
          </View>
        </View>
        <View>
          <FlatList
            data={playLists}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
          />
        </View>

        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          Your Top Artists
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists?.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView>
        <View style={{height: 10}} />
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          Recently Played
        </Text>
        <View>
          <FlatList
            data={recentlyplayed}
            horizontal
            renderItem={({item, index}) => (
              <RecentlyPlayedCard item={item} key={index} />
            )}
          />
        </View>
      </ScrollView>
      {currentTrack && <PlayerTrack />}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
