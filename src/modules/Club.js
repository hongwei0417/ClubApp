import * as firebase from 'firebase'
import * as ClubAction from '../actions/ClubAction'
import { getClubData, updateClub, updateUser } from './Data'
import { selectPhoto } from './Common'

/*
|-----------------------------------------------
|   Database相關
|-----------------------------------------------
*/

//依據傳入club物件去產生一個完整clubList(含selectStatus)
export const getClubListForSelecting  = async (allClub) => {
  try {
    const clubList = {};

    const promises = Object.keys(allClub).map(async (element) => {

      const club = await getClubData(element);

      const tempObj = {};
      tempObj[element] = {
        clubKey: element,
        selectStatus: true,
        schoolName: club.schoolName,
        clubName: club.clubName
      };
      clubList = { ...clubList, ...tempObj };
    });
    await Promise.all(promises);
    return clubList;
  }
  catch (error) {
    console.log(error.toString());
  }
}

export const getAllClubData = async () => {

  try {
    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('users').child(user.uid)
    const userShot = await userRef.once('value')
    const { joinClub, likeClub } = userShot.val()
    
    let allClubCid = []
    let allClubData = {}

    if (joinClub)
      allClubCid = [...allClubCid, ...Object.keys(joinClub)]

    if (likeClub)
      allClubCid = [...allClubCid, ...Object.keys(likeClub)]

    const promises = allClubCid.map(
      async (cid) => {
        const clubShot = await firebase.database().ref('clubs/' + cid).once('value')
        allClubData[cid] = clubShot.val()
      }
    )

    await Promise.all(promises)

    console.log(allClubData)

    return allClubData

  } catch (e) {
    console.log(e)
    throw e
  }


}

/*
|-----------------------------------------------
|   社團相關操作
|-----------------------------------------------
*/

export const createClub = (schoolName, clubName, open) => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    const cid = await firebase.database().ref('club').push().key
    let newJoinClub = { ...getState().userReducer.joinClub }
    let newClubNotificationList = { ...getState().settingReducer.clubNotificationList }
    let newClubs = { ...getState().clubReducer.clubs }

    newJoinClub[cid] = true
    newClubNotificationList[cid] = {
      schoolName,
      clubName,
      on: true,
    }

    let member = {}
    member[user.uid] = { status: 'master' }

    let newClub = {
      schoolName,
      clubName,
      open,
      member,
      initDate: new Date().toLocaleString(), //格式：2018/8/30 下午3:07:08
      imgUrl: false,
      introduction: false,
    }

    newClubs[cid] = newClub

    let clubData = {
      newJoinClub, //userReducer更新
      newClubNotificationList, //settingReducer更新
      newClubs, //clubReducer更新
    }


    await firebase.database().ref('clubs/' + cid).set(newClub)
    await firebase.database().ref('users/' + user.uid + '/joinClub').update(newJoinClub)
    await firebase.database().ref('settings/' + user.uid + '/clubNotificationList/' + cid).update({ on: true })



    dispatch(ClubAction.createClubSuccess(clubData))

  } catch (e) {
    console.log(e)
    dispatch(ClubAction.createClubFail(e.toString()))
    throw e
  }
}

export const quitTheClub = (cid) => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    const joinClubRef = firebase.database().ref('users/' + user.uid + '/joinClub/' + cid)
    const clubNotificationRef = firebase.database().ref('settings/' + user.uid + '/clubNotificationList/' + cid)

    let newJoinClub = {...getState().userReducer.joinClub}
    let newClubNotificationList = {...getState().settingReducer.clubNotificationList}
    let newClubs = {...getState().clubReducer.clubs}

    delete newJoinClub[cid]
    delete newClubNotificationList[cid]
    delete newClubs[cid]

    let clubData = { newJoinClub, newClubNotificationList, newClubs }

    await joinClubRef.remove()
    await clubNotificationRef.remove()

    dispatch(ClubAction.removeTheClub(clubData))

  } catch (e) {
    console.log(e.toString())
    throw e
  }

}

//轉換status成中文
export const changeMemberStatusToChinese = (status) => {
  if(status==='master'){
    return '社長';
  }
  else{
    return '社員';
  }
}

export const changeClubPhoto = (cid) => async (dispatch, getState) => {
  try {
    const clubRef = firebase.database().ref('clubs').child(cid)
    const url = await selectPhoto()

    if(url) {
      let { clubs } = getState().clubReducer
      let newClubs = JSON.parse(JSON.stringify(clubs))
      newClubs[cid].imgUrl = url
      //更新database
      await clubRef.update(newClubs[cid])

      //更新firestore
      
      //更新redux
      dispatch(ClubAction.setClubPhoto(newClubs))
      
    } else {
      throw new Error('取消選擇照片')
    }


  } catch (e) {
    console.log(e)
    throw e
  }
}

export const setClubOpen = (cid) => async (dispatch, getState) => {
  try {
    const clubRef = firebase.database().ref('clubs').child(cid)
    const { clubs } = getState().clubReducer

    
    let newClubs = JSON.parse(JSON.stringify(clubs))
    newClubs[cid].open = !newClubs[cid].open

    //更新database
    await clubRef.update(newClubs[cid])
    //更新redux
    dispatch(ClubAction.setClubOpen(newClubs))

  } catch(e) {
    console.log(e)
    throw e
  }
}

export const kickClubMember = (cid, uid) => async (dispatch, getState) => {
  try {
    const memberRef = firebase.database().ref('clubs').child(cid).child('member')
    const joinClubRef = firebase.database().ref('users').child(uid).child('joinClub')
    const { clubs } = getState().clubReducer

    let newClubs = JSON.parse(JSON.stringify(clubs))
    delete newClubs[cid].member[uid]

    //資料庫
    await memberRef.remove(uid)
    await joinClubRef.remove(cid)

    //redux
    dispatch(ClubAction.deleteClubMember(newClubs))

  } catch(e) {
    console.log(e)
    throw e
  }
}

export const searchAllClub = async () => {
  try {
    const allClubRef = firebase.database().ref('clubs')
    const allClubShot = await allClubRef.once('value')
    const allClubData = allClubShot.val()

    return allClubData

  } catch(e) {
    console.log(e)
    throw e
  }
}




