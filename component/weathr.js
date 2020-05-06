import React from 'react'
import {View,Text,Image,ImageBackground,StyleSheet, Button,Alert,ActivityIndicator, PermissionsAndroid} from 'react-native'
import DropdownMenu from 'react-native-dropdown-menu';
import { NetworkInfo } from "react-native-network-info";
import publicIP from 'react-native-public-ip';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';

export default class Weather extends React.Component {
state={
  data:[],
  currentDate :'',
  City :'',
  weatherData :{},
  monthNames:[],
  Days:[],
  loading:false, 
  image: ''
}
  
componentDidMount() {
  this.setState({loading:true})
  this.getMyIp()
  this.ShowCurrentDate()
}

 requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Weather app need Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

getMyIp = async () => {
  
  const myData = await AsyncStorage.getItem('userdata')
  console.log("ASYNC-DATA", JSON.parse(myData));


  publicIP()
  .then(ip => {
    fetch('http://ip-api.com/json/'+ip)
    .then((res) => res.json())
    .then((result) => {
      if(!result.city) {
        alert('Unable to fetch city from your IP, Choose city from the box')
        this.setState({loading: false})
      } else {
      this.setState({City: result.city}, () => {
        this.fetchWeather()
      })
    }
    })
  })
}

fetchWeather = () => {
  this.setState({loading: true})
  const city = this.state.City
  fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&apikey=5626099b25a6452723157c33f756c466&units=metric')
  .then(result  =>result.json())
  .then(data =>{
      if(!data.name) {
        alert('Unable to fetch city from your IP, Choose city from the box')
        this.setState({loading: false})
      } else {
        this.setState({weatherData:data, loading: false})
        console.log(data)
      }

  })
}

changeCity = (city) => {
  this.setState({City: city}, () => {
    this.fetchWeather()
  })
}
 
ShowCurrentDate=()=>{
  let monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let Days = ['Sat','Sun','Mon','Tue','Wed','Thu','Fri']
  let date = Days[ new Date().getDay()]
  let  month = monthNames[new Date().getMonth()]
  let year = new Date().getFullYear();

  this.setState({currentDate: `${date}-${month}-${year}`})
 }

 pickImage = () => {
  this.requestCameraPermission()
  const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  
  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);
  
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = { uri: response.uri };
  
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
  
      this.setState({
        image: source,
      });
    }
  });
 }

render(){

    const data = [["kolkata",  "palestine", "Dubai","Amman","Nablus"]]
return(
<>

  <ImageBackground
    source={require("../assest/background.jpg")}
    style={{width:"100%",height:"100%"}}
  >
    <View style={{height: 100,paddingVertical:20}}>
     <DropdownMenu 
          style={{ marginTop:10,marginHorizontal:20 }}
          bgColor={'white'}
          tintColor={'#666666'}
          activityTintColor={'green'}
          // arrowImg={{paddingHorizontal:20}}      
          // checkImage={}   
           optionTextStyle={{color: '#333333'}}
          titleStyle={{color: '#333333', paddingHorizontal:80}} 
          // maxHeight={300} 
           handler={(selection, row) => this.changeCity(data[selection][row])}
           data={data}
        >
      </DropdownMenu>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="red" animating={this.state.loading} />

        <Text style={{fontSize:50, color:'white',fontWeight: "bold" }}> {this.state.weatherData.name}  </Text>

        <Text style={styles.Text ,{fontSize:30,color:'white'}}>{this.state.currentDate}</Text>

<Text style={styles.Text}> {this.state.weatherData.main  ? this.state.weatherData.main.temp : 0}°C</Text>

  <Text style={{marginHorizontal:10,justifyContent:'center' ,color:'white',fontWeight:'bold'}}>--------------------</Text>

      <Text style={styles.Text}>{this.state.weatherData.weather ? this.state.weatherData.weather[0].main: 0} </Text>
<Text style={{fontSize:15 , color:'white'}}>{this.state.weatherData.weather ? this.state.weatherData.weather[0].description :0}</Text>


      </View>

      <Image source={ this.state.image} style={{height: 150, width: 150}} />

      <Button title="Choose Image" onPress={this.pickImage} />

  </ImageBackground>
</>




)

}


}

const styles=StyleSheet.create ({

Text :{
  color:'white',
  justifyContent:'center',
  fontWeight: "bold",
  fontSize:40
}


  
})