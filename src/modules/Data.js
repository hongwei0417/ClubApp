import * as firebase from "firebase"

/*
|-----------------------------------------------
|   database取得資料
|-----------------------------------------------
*/

//取得user
export const getUserData = async (uid) => {
    const userRef = firebase.database().ref('users').child(uid)
    const snapShot = await userRef.once('value');
    return snapShot.val();
}

//取得userSetting
export const getUserSetting = async (uid) => {
    const settingRef = firebase.database().ref('userSettings').child(uid)
    const snapShot = await settingRef.once('value')
    return snapShot.val()
}

//取得club
export const getClubData = async (cid) => {
    const clubRef = firebase.database().ref('clubs').child(cid)
    const snapShot = await clubRef.once('value');
    return snapShot.val();
};

//取得所有文章資料
export const getPostData = async (cid) => {
    const postRef = firebase.database().ref('posts').child(cid)
    const snapShot = await postRef.once('value');
    const postData = snapShot.val();
    return postData;
}

//取得某一篇文章資料
export const getInsidePostData = async (cid, pid) => {
    const postRef = firebase.database().ref('posts').child(cid).child(pid)
    const snapShot = await postRef.once('value');
    const postData = snapShot.val();
    return postData;
}

//從firebase取得指定club下指定post之所有留言
export const getPostComments = async (clubKey, postKey) => {
    const commentRef = firebase.database().ref('comments/' + clubKey + '/' + postKey);
    const snapShot = await commentRef.once('value');
    const CommentData = snapShot.val();
    return CommentData;
}

/*
|-----------------------------------------------
|   database更新資料
|-----------------------------------------------
*/

//更新Post.Views
export const updatePostViews = async (clubKey, postKey, updateViews) => {
    const uid = Object.keys(updateViews)[0];
    const value = Object.values(updateViews)[0];
    const viewsRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/views/' + uid);
    await viewsRef.set(value)
}

//更新Post.Favorites
export const updatePostFavorites = async (clubKey, postKey, updateFavorites) => {
    const uid = Object.keys(updateFavorites)[0];
    const value = Object.values(updateFavorites)[0];
    let favoritesRef;
    if (value == false) {
        favoritesRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/favorites');
    }
    else {
        favoritesRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/favorites/' + uid);
    }
    await favoritesRef.set(value);
}

//更新使用者基本資料
export const updateUser = async (uid, userData) => {
    const userRef = firebase.database().ref('users').child(uid)
    await userRef.update(userData)
}

//更新使用者設定
export const updateUserSetting = async (uid, settingData) => {
    const settingRef = firebase.database().ref('userSettings').child(uid)
    await settingRef.update(settingData)
}

//更新社團基本資料
export const updateClub = async (cid, clubData) => {
    const clubRef = firebase.database().ref('clubs').child(cid)
    await clubRef.update(clubData)
}


/*
|-----------------------------------------------
|   database刪除資料
|-----------------------------------------------
*/


/*
|-----------------------------------------------
|   database建立資料
|-----------------------------------------------
*/

//新增comment、post下numComment+1
export const createComment = async (clubKey, postKey, content) => {
    const getNumRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/numComments');
    let snapShot = await getNumRef.once('value');
    let numComments = snapShot.val();
    numComments = numComments + 1;
    await getNumRef.set(numComments);

    const user = firebase.auth().currentUser;
    const commentRef = firebase.database().ref('comments/' + clubKey + '/' + postKey).push();
    const commentData = {
        commenter: user.uid,
        date: new Date().toLocaleString(),
        content: content
    }
    await commentRef.set(commentData);
}

//刪除comment、post下numComment-1
export const deleteComment = async (clubKey, postKey, commentKey) => {
    const getNumRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/numComments');
    let snapShot = await getNumRef.once('value');
    let numComments = snapShot.val();
    numComments = numComments - 1;
    await getNumRef.set(numComments);

    let commentRef;

    commentRef = firebase.database().ref('comments/' + clubKey + '/' + postKey + '/' + commentKey)
    await commentRef.set(null);


}

//編輯留言
export const editComment = async (clubKey, postKey, commentKey, content) => {
    if (content == '') {
        console.log('NO change');
    }
    else {
        let update = {};
        update['/comments/' + clubKey + '/' + postKey + '/' + commentKey + '/content'] = content;
        firebase.database().ref().update(update);
    }
}