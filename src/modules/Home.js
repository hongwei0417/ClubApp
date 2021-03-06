import * as HomeAction from '../actions/HomeAction'
import { initPostListToReducer, syncPost } from './Post';
import { initActivityListToReducer, syncActivity } from './Activity';
import { getClubData } from './Data';
import * as firebase from "firebase";
require("firebase/functions");

//********************************************************************************
// reload function
//********************************************************************************

//貼文列重整
export const getHomePostReload = (clubList, navigation) => async (dispatch, getState) => {
    try {
        const newClubList = {};
        let numSelect = 0;

        const joinClub = getState().userReducer.joinClub;
        const likeClub = getState().userReducer.likeClub;
        const nextClub = { ...joinClub, ...likeClub };

        let i;
        const clubKey = Object.keys(nextClub);
        for (i = 0; i < clubKey.length; i++) {
            if (clubList[clubKey[i]]) {
                newClubList[clubKey[i]] = clubList[clubKey[i]];
                if (clubList[clubKey[i]].selectStatus) {
                    numSelect = numSelect + 1;
                }
            }
            else {
                const club = await getClubData(clubKey[i]);
                newClubList[clubKey[i]] = {
                    clubKey: clubKey[i],
                    selectStatus: true,
                    schoolName: club.schoolName,
                    clubName: club.clubName,
                };
                numSelect = numSelect + 1;
            }
        }

        dispatch(HomeAction.getHomeClubListSuccess(newClubList, numSelect));
        const getHomePost = firebase.functions().httpsCallable('getHomePost');
        const response = await getHomePost(clubList);
        if (response.data.postListArr) {
            //丟進reducer
            dispatch(initPostListToReducer(response.data.postListArr, navigation));
            //檢查同步
            dispatch(syncPost(response.data.postListArr))
        }
        determinToSearch(clubList, response.data.postListArr, navigation);
    }
    catch (error) {
        console.log(error.toStirng());
    }
}

//活動列重整
export const getHomeActivityReload = (navigation) => async (dispatch, getState) => {
    try {
        const getUserActivity = firebase.functions().httpsCallable('getUserActivity');
        const response = await getUserActivity();
        if (response.data) {
            //丟進reducer
            dispatch(initActivityListToReducer(response.data, navigation));
            //檢查同步
            dispatch(syncActivity(response.data))
        }
        else{
            alert('你還沒有收藏活動唷!');
        }
    }
    catch (error) {
        console.log(error.toStirng());
    }
}


//********************************************************************************
// main function
//********************************************************************************

//抓joinClub與likeClub，產生clubList放入homeReducer控制篩選 （初始狀態）
export const initHomeClubList = (joinClub, likeClub) => async (dispatch) => {
    try {
        const allClub = { ...joinClub, ...likeClub };
        const clubList = await getClubListForSelecting(allClub);
        const numSelectingStatusTrue = Object.keys(clubList).length;

        dispatch(HomeAction.getHomeClubListSuccess(clubList, numSelectingStatusTrue));
        return clubList;
    }
    catch (error) {
        dispatch(HomeAction.getHomeClubListFailure(error.toString()));
        console.log(error.toString());
    }
}

//改變HomeClubList的selectStatus，並判斷是否有關閉全部selectStatus
export const setHomeClubListStatus = (clubKey, clubList, numSelectingStatusTrue) => async (dispatch) => {
    try {
        if (numSelectingStatusTrue == 1) {
            if (clubList[clubKey].selectStatus == true) {
                alert('至少需開啟一個社團！');
            }
            else {
                clubList[clubKey].selectStatus = !(clubList[clubKey].selectStatus);
                numSelectingStatusTrue = numSelectingStatusTrue + 1;
                dispatch(HomeAction.setHomeClubListStatusSuccess(clubList, numSelectingStatusTrue));
            }
        }
        else {
            if (clubList[clubKey].selectStatus == false) {
                numSelectingStatusTrue = numSelectingStatusTrue + 1;
            }
            else {
                numSelectingStatusTrue = numSelectingStatusTrue - 1;
            }
            clubList[clubKey].selectStatus = !(clubList[clubKey].selectStatus);
            dispatch(HomeAction.setHomeClubListStatusSuccess(clubList, numSelectingStatusTrue));
        }
        return clubList;
    }
    catch (error) {
        dispatch(HomeAction.setHomeClubListStatusFailure(error.toString()));
        console.log(error.toString());
    }
}

//********************************************************************************
// auxiliary functiob
//********************************************************************************

//依據傳入club物件去產生一個完整clubList(含selectStatus)
export const getClubListForSelecting = async (allClub) => {
    try {
        const clubList = {};

        const promises = Object.keys(allClub).map(async (element) => {

            const club = await getClubData(element);

            const tempObj = {};
            tempObj[element] = {
                clubKey: element,
                selectStatus: true,
                schoolName: club.schoolName,
                clubName: club.clubName,
            };
            clubList = { ...clubList, ...tempObj };
        });
        await Promise.all(promises);
        return clubList;
    }
    catch (error) {
        console.log(error.toString());
        throw error;
    }
}

//判斷是否使用者有收藏或加入社團與社團是否有存在文章
export const determinToSearch = (clubList, postArr, navigation) => {
    try {
        if (Object.keys(clubList).length == 0) {
            alert('你目前還沒有加入或收藏社團，看看我們推薦給你的社團！');
            //換頁處理
            navigation.navigate("Search");
        }
        else {
            if (postArr.length == 0) {
                // alert('您的社團目前未存在任何文章！');
            }
        }
    }
    catch (error) {
        throw error;
    }
}
