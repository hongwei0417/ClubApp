import React from 'react';
import { Dimensions, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image, RefreshControl, ImageBackground, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../styles/home/ActivityListElement'
const Dimensionsss = require('Dimensions');
const { width, height, scale } = Dimensions.get('window');
{
    //     const cols = 3; 
    // const cellWH = 100; 
    // const vMargin = (screenW - cellWH * cols) / (cols + 1); 
}



const ActivityListElement = ({
    activity,
    navigation,
    setActivityFavorite,
    getInsideActivity,
    parentOverLayor,
    syncActivity,
    syncActivityDelete,
    syncActivityBack,
}) => {

    //活動按讚
    async function pressFavorite(activity) {
        parentOverLayor();
        let obj = await setActivityFavorite(activity.clubKey, activity.activityKey);
        if (obj != null) {
            //活動同步
            syncActivity(obj);
        }
        else {
            //刪除活動同步
            syncActivityDelete(activity.activityKey);
            Alert.alert("該活動不存在！");
        }
        parentOverLayor();
    }

    //進入內頁
    async function insideActivity(activity) {
        parentOverLayor();
        const obj = await getInsideActivity(activity.clubKey, activity.activityKey);
        if (obj != null) {
            parentOverLayor();
            //活動同步
            syncActivity(obj);
            let routeName;
            if (navigation.state.routeName == 'Stories') {
                routeName = 'HomeActivity'
            }
            else if (navigation.state.routeName == 'SearchClub') {
                routeName = 'SearchActivity'
            }
            else {
                routeName = navigation.state.routeName + "Activity";
            }
            navigation.navigate(routeName, {
                activity: obj.activity,
                syncActivityBack: syncActivityBack
            });
        }
        else {
            //刪除活動同步
            syncActivityDelete(activity.activityKey);
            Alert.alert("該活動不存在！");
            parentOverLayor();
        }
    }

    return (
        <TouchableOpacity style={styles.posterView}
            onPress={async () => { await insideActivity(activity); }}>
            <ImageBackground source={{ uri: activity.photo }}
                resizeMode='cover'
                style={styles.poster}>

                <View style={styles.black}>
                    <View style={styles.actTextView}>
                        <Text style={styles.actText}>{activity.title}</Text>
                    </View>

                    <View style={styles.clubTextView}>
                        <Text style={styles.clubText}>{activity.schoolName}{activity.clubName}</Text>
                    </View>
                    {
                        // <View style={styles.clubTextView}>
                        //     <Text style={styles.clubText}>{activity.clubName}</Text>
                        // </View>
                    }
                    <Image source={{ uri: activity.posterPhotoUrl }}
                        resizeMode='cover'
                        style={styles.clubImage}
                        imageStyle={styles.clubImage}
                    />
                    <TouchableOpacity style={styles.heartView}
                        onPress={async () => { await pressFavorite(activity); }}>
                        <Image
                            style={styles.likeIcon}
                            source={activity.statusFavorite ? require("../../images/like-orange.png") : require("../../images/like-gray.png")}
                        />
                        <Text style={styles.heartText}> {activity.numFavorites}</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </TouchableOpacity>
    );
};

export default ActivityListElement;

