import React from  'react'
import {} from 'react-native'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Weather from '../component/weathr'
import Splash from '../component/splash'

const weather = createStackNavigator({
    Weather:{
        screen: Weather
    },
    Splash :{
        screen:Splash
    }
},
{
    initialRouteName:'Splash'
}

)
const AppContainer = createAppContainer(weather)

export default class Navigator extends React.Component{

render(){

    return(
        <AppContainer/>
    )
}

}