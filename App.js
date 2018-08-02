import React from 'react';
import Exop from 'expo';
import * as firebase from "firebase";
import { StyleSheet, Text, View } from 'react-native';
import createRootRouter from './src/routers/Router'
import { rootReducer } from './src/reducers/Reducer'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import firebaseConfig from './src/firebaseConfig'
import { updateUser } from './src/actions/AuthAction'
import { Spinner } from './src/components/common/Spinner'



const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger))




export default class App extends React.Component {

  state = {
    loaded: false //是否載入
  }

  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
    
    firebase.auth().onAuthStateChanged((user) => { //監聽起始點
      
      console.log('user is', user)

      if(!this.state.loaded) {
        this.setState({ loaded: true }); 
        if(user) {
          store.dispatch(updateUser({...user})); //更新UserState
        }
      }
      else {
        this.setState({ loaded: false })
        setTimeout(()=>this.setState({ loaded: true}), 2000)
      }
      
    })
  }

  render() {
    const RootRouter = createRootRouter()
    return (
      <Provider store={store}>
        {this.state.loaded ? <RootRouter /> : <Spinner />}
      </Provider>
    );
  }
}


