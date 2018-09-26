import React from 'react'
import { View, Text, TextInput, Alert, Image, StatusBar, TouchableOpacity } from 'react-native'
import Overlayer from '../common/Overlayer'
import { Icon, SearchBar, Button } from 'react-native-elements'
import { Constants } from 'expo';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import styles from '../../styles/personal/ChangeEmail' 


class ChangeEamil extends React.Component {

  state = {
    password: '',
    newEmail: '',
    loading: false
  }

  handleChangeEmail = async (newEmail, password) => {
    try {
      if(newEmail && password) {
        if(password == this.props.password) {
          this.setState({ loading: true })
          await this.props.changeEmail(newEmail, password)
          Alert.alert('更改成功')
          this.props.navigation.pop()
        }
        else {
          Alert.alert('密碼錯誤')
        }
      }
      else {
        Alert.alert('請勿空白')
      }
    } catch(e) {
      Alert.alert(e.toString())
      this.setState({ loading: false })
    }
  }

  render() {
    return (
        <View style={styles.container}>
            <StatusBar hidden={false} height={50} backgroundColor={'#f6b456'} />
            <View style={styles.headView}>
                <View >
                    <TouchableOpacity>
                        <Image source={require('../../images/arrowLeft.png')}
                            style={styles.arrow} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headText}>變更電子信箱</Text>
                <View style={styles.fake}></View>
                </View>

            <View style={styles.containView}>
            <View style={styles.upView}>
            <View style={styles.passwordView}>
                <Text style={styles.passwordText}>輸入新的電子信箱</Text>
                <TextInput 
                placeholder='新的電子信箱' autoCapitalize='none'
                onChangeText={(newEmail) => {this.setState({ newEmail })}} 
                style={styles.passwordInput}></TextInput>
            </View>

            <View style={styles.passwordView}>
                <Text style={styles.passwordText}>輸入登入密碼</Text>
                <TextInput 
                placeholder='請輸入密碼'
                onChangeText={(password) => {this.setState({ password })}} 
                style={styles.passwordInput}
                secureTextEntry={true}></TextInput>
            </View>
            </View>
            <TouchableOpacity 
            onPress={() => this.handleChangeEmail(this.state.newEmail, this.state.password)}
            style={styles.buttonView}>
                <Text style={styles.button}>確認</Text>
            </TouchableOpacity>

            <Text style={styles.redText}>請至您的電子信箱確認</Text>
            {this.state.loading ? <Overlayer /> : null }
          </View>
        <View style={styles.tabBar}></View>
    </View>

                
  );
}
}

export default ChangeEamil





