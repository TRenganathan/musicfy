import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
const PlayListScreen = () => {
  const route = useRoute();
  const playList = route?.params?.item;

  const [inputValue, setInputValue] = useState('');
  return (
    <View style={{backgroundColor: '#9b6078', flex: 1, padding: 10}}>
      <ScrollView style={{height: 100, marginTop: 30}}>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              backgroundColor: '#ab7a8d',
              paddingVertical: 5,
              paddingHorizontal: 10,
              flex: 1,
              borderRadius: 5,
            }}>
            <AntDesign name="search1" color="white" size={20} />
            <TextInput
              value={inputValue}
              onChangeText={text => setInputValue(text)}
              style={{height: 40, padding: 10}}
              placeholder="search"
              placeholderTextColor={'white'}
            />
          </Pressable>

          <Pressable
            style={{
              height: 40,
              backgroundColor: '#ab7a8d',
              display: 'flex',
              justifyContent: 'center',
              paddingHorizontal: 20,
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <View>
              <Text style={{color: 'white'}}>sort</Text>
            </View>
          </Pressable>
        </Pressable>
        <View style={{marginTop: 50}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
          {[1, 2, 3, 4].map((item, i) => {
            return (
              <View key={i}>
                <View
                  style={{
                    height: 150,
                    width: 150,
                    borderColor: 'green',
                    borderWidth: 2,
                  }}></View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default PlayListScreen;

const styles = StyleSheet.create({});
