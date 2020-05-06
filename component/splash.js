import React, { useEffect } from 'react'
import {View,Image,Text, StatusBar,ImageBackground} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export default Splash =(props)=>{

    useEffect(() => {
        saveData()
        setTimeout(() => {
            props.navigation.replace('Weather')
        }, 2000)
    },[])

    const saveData = async () => {
        await AsyncStorage.setItem('userdata', JSON.stringify({name: 'uday', id: '53645'}))
    }

    return(

        <View> 
            <StatusBar hidden={true} />
            
        <ImageBackground  source={require('../assest/weather.png')}   style={{width:"100%",height:"100%"}}/>

        </View>

    )
}

Splash.navigationOptions = ({ navigation }) => {
    return {
        header: null,
        title: 'hello',
    }
}