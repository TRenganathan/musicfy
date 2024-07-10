import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authorize} from 'react-native-app-auth';
const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem('token');
      const expirationDate = await AsyncStorage.getItem('expirationDate');
      console.log('access token', accessToken);
      console.log('expiration date', expirationDate);

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate, 10)) {
          // Token is still valid
          navigation.replace('Main');
          navigation.navigate('Main');
        } else {
          // Token has expired
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('expirationDate');
        }
      }
    };

    checkTokenValidity();
  }, []);

  const Authenticate = async () => {
    setLoading(true);
    const config = {
      issuer: 'https://accounts.spotify.com/',
      clientId: 'b8278a24e1f54dd4b7216aee29074ef8',
      scopes: [
        'user-read-email',
        'user-library-read',
        'user-read-recently-played',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public', // or "playlist-modify-private"
      ],
      redirectUrl: 'com.musicfy://callback',
    };

    try {
      const result = await authorize(config).then(res => {
        // console.log(res, 'RESPONSE');
        if (res.accessToken) {
          const expirationDate = new Date(
            res.accessTokenExpirationDate,
          ).getTime();
          AsyncStorage.setItem('token', res.accessToken);
          AsyncStorage.setItem('expirationDate', expirationDate.toString());
          navigation.navigate('Main');
        }
      });
      // console.log(result);
    } catch (error) {
      console.error('Spotify login error:', error);
      Alert.alert('Error', 'Failed to authenticate with Spotify.');
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   const handleRedirect = async event => {
  //     const url = event.nativeEvent.url;
  //     const regex = /^com\.spotifyclone\.myapp:\/\/callback\/\?(.*)$/;
  //     const match = url.match(regex);
  //     if (match) {
  //       const params = new URLSearchParams(match[1]);
  //       const code = params.get('code');
  //       // Handle the authorization code here
  //       console.log(`Authorization code: ${code}`);
  //     }
  //   };

  //   Linking.addEventListener('url', handleRedirect);
  // }, []);
  return (
    <View style={styles.container}>
      <View style={{height: '100%'}}>
        <View style={{height: 80}} />
        <Entypo
          name="spotify"
          size={80}
          color="white"
          style={{textAlign: 'center'}}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 40,
          }}>
          Millions of Songs Free on spotify!
        </Text>

        <View style={{height: 80}} />
        {loading ? (
          <ActivityIndicator size="large" color="#1DB954" />
        ) : (
          <Pressable
            onPress={Authenticate}
            style={{
              // backgroundColor: '#1DB954',
              backgroundColor: 'green',
              padding: 10,
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 25,
              width: 300,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <Text>Sign In with spotify</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => {
            console.log('Hello world');
          }}
          style={{
            backgroundColor: '#131624',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            borderColor: '#C0C0C0',
            borderWidth: 0.8,
            marginBottom: 10,
          }}>
          <MaterialIcons name="phone-android" size={24} color="white" />
          <Text
            style={{
              fontWeight: '500',
              color: 'white',
              textAlign: 'center',
              flex: 1,
            }}>
            Continue with phone number
          </Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: '#131624',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            borderColor: '#C0C0C0',
            borderWidth: 0.8,
            marginBottom: 10,
          }}>
          <AntDesign name="google" size={24} color="red" />
          <Text
            style={{
              fontWeight: '500',
              color: 'white',
              textAlign: 'center',
              flex: 1,
            }}>
            Continue with Google
          </Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: '#131624',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            borderColor: '#C0C0C0',
            borderWidth: 0.8,
          }}>
          <Entypo name="facebook" size={24} color="blue" />
          <Text
            style={{
              fontWeight: '500',
              color: 'white',
              textAlign: 'center',
              flex: 1,
            }}>
            Sign In with facebook
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131624',
  },
});
