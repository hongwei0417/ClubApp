import * as AuthAction from '../actions/AuthAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import Expo from 'expo' 
import { Alert } from 'react-native'
import { getUserAllState, createUserInDatabase } from './User'
import { clearUser } from '../actions/UserAction'

const signInSuccess = (action, user, password, loginType) => async (dispatch) => {

  try {
    const userRef = firebase.database().ref('/users').child(user.uid)
    const snapShot = await userRef.once('value')
    const userInfo = { password, loginType }
    let userState = null

    if(snapShot.val()) { //之前登入過
      userState = await getUserAllState(user)
    }
    else { //第一次登入
      userState = await createUserInDatabase(user, userInfo)
    }

      
    dispatch(action(userState))
    

  } catch(e) {

    throw e
  }
  
}

export const signInWithEmail = (email, password, remember) => async (dispatch) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  dispatch(AuthAction.signInRequest(remember)) //登入要求
  
  try {
    
    const {user} = await firebase.auth().signInWithEmailAndPassword(email, password);
    
    dispatch(signInSuccess(AuthAction.signInSuccess, user, password, 'normal')) //登入成功

    
  } catch(error) {

    dispatch(AuthAction.signInFail(error.toString())) //登入失敗

    dispatch(CommonAction.setLoadingState(false))

    Alert.alert('登入失敗')

    console.log(error.toString())
  }

}

export const signUpUser = (newUser) => async (dispatch) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  dispatch(AuthAction.signUpRequest()) //註冊要求

  try {
    const { email, password } = newUser
    //建立使用者完firebase會自動登入
    const {user} = await firebase.auth().createUserWithEmailAndPassword(email, password)

    dispatch(signInSuccess(AuthAction.signUpSuccess, user, password, 'normal')) //註冊成功並更新UserState

    Alert.alert('註冊成功(自動幫您登入)')


  } catch(error) {
    dispatch(AuthAction.signUpFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //取消等待狀態

    Alert.alert('註冊失敗')

    console.log(error.toString())
  }

}

export const signInWithFacebook = () => async (dispatch) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  dispatch(AuthAction.signWithFacebookRequest()) //facebook登入要求

  try {
    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('221789121856824', { permissions: ['email'] })

    if(type == 'success') {

      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      const {user} = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      dispatch(signInSuccess(AuthAction.signWithFacebookSuccess, user, null, 'Facebook')) //facebook登入並更新狀態

    }
    else {
      dispatch(CommonAction.setLoadingState(false)) //結束等待狀態
    }


  } catch(error) {

    dispatch(AuthAction.signWithFacebookFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //結束等待狀態

    console.log(error.toString())

    throw error

  }
}

export const signInWithGoogle = () => async (dispatch) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態
  
  dispatch(AuthAction.signWithGoogleRequest()) //google登入要求

  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: "951052400924-slt3s3uvfngbobeun5p4q2v0rmnm90jb.apps.googleusercontent.com",
      iosClientId: "951052400924-73rm091duv4rkh15a9mrunlrm5j96rg2.apps.googleusercontent.com",
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {

      const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)
      const {user} = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      dispatch(signInSuccess(AuthAction.signWithGoogleSuccess, user, null, 'Google')) //google登入並更新狀態

    } else {
      dispatch(CommonAction.setLoadingState(false)) //取消等待狀態
    }
    
  } catch(error) {

    dispatch(AuthAction.signWithGoogleFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //取消等待狀態

    console.log(error.toString())

    throw error
  }

}

export const sendVerifiedMail = () => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    await user.sendEmailVerification() //firebase發送驗證信
    dispatch(AuthAction.sendVerifiedEmailSuccess())

    Alert.alert("驗證信已發送！")

  } catch(error) {
    dispatch(AuthAction.sendVerifiedEmailFail(error.toString()))
    
    Alert.alert("驗證信已發送！")

    console.log(error.toString())
  }
  
}

export const emailVerified = () => async (dispatch, getState) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {
    
    await dispatch(reloadUser()) //更新使用者

    const { user } = getState().authReducer

    if(user.emailVerified) {

      Alert.alert('驗證成功')

    } else {

      dispatch(CommonAction.setLoadingState(false)) //取消登帶狀態
      Alert.alert('驗證失敗')

    }

  } catch(error) {

    console.log(error.toString())
  }

}

export const sendResetMail = (email) => async (dispatch) => {

  try {
    await firebase.auth().sendPasswordResetEmail(email) //firebase寄發重設信
    dispatch(AuthAction.sendResetEmailSuccess())

  } catch(error) {
    dispatch(AuthAction.sendResetEmailFail(error.toString()))

    console.log(error.toString())
  }

}

export const signOut = () => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {
    await firebase.auth().signOut()
    dispatch(clearUser())

    setTimeout(
      () => dispatch(CommonAction.setLoadingState(false)), //進入等待狀態
      1000
    )
    

  } catch(error) {
    dispatch(AuthAction.signOutFail(error.toString()))

    console.log(error.toString())
  }
  
}
