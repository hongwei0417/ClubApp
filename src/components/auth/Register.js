import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Form ,Label, Item, Input, Icon, Button, Footer } from 'native-base'

class Register extends React.Component {  
  state = {
    newUser: {
      nickName: '',
      email: '',
      password: ''
    }
  }
  componentDidMount() {
    
  }

  handleSignUp = async () => {
    const { dispatch, navigation, signUpUser } = this.props
    const { newUser } = this.state
    await signUpUser(newUser)
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Label style={{alignSelf: 'center'}}>註冊</Label>
        <Form>
          <Item floatingLabel>
            <Label>暱稱</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              textAlign="center"
              placeholder="你/妳想要朋友怎麼稱呼"
              onChangeText={(nickName) => this.setState({newUser: {...this.state.newUser, nickName}})}
            />
          </Item>
          <Item floatingLabel>
            <Label>信箱</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              textAlign="center"
              placeholder="abc123@iclub.com"
              onChangeText={(email) => this.setState({newUser: {...this.state.newUser, email}})}
            />
          </Item>
          <Item floatingLabel>
            <Label>密碼</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              textAlign="center"
              placeholder="password"
              onChangeText={(password) => this.setState({newUser: {...this.state.newUser, password}})}
            />
          </Item>
          <Button style={{ marginTop: 10 }} 
            full
            rounded 
            primary
            onPress={() => this.handleSignUp()}
            >
              <Text style={{ color: 'white'}}>Sign Up</Text>
          </Button>
        </Form>
      </View>
    )
  }
}

export default Register