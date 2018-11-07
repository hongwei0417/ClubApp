import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image, RefreshControl } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../styles/club/Activities'
import MapView, { Marker } from 'react-native-maps'
import { showLocation } from 'react-native-map-link'
import { Location, DangerZone } from 'expo'
import Overlayer from '../common/Overlayer'
import { convertDateFormat } from '../../modules/Common'

class Activity extends React.Component {

    //寫入本地State
    async componentWillMount() {
        this.setState({ activity: this.props.activity });
    }

    state = {
        activity: {},
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        loading: false,
        refreshing: false,
    }

    onRefresh = () => {
        try {
            this.setState({ refreshing: true });
            this.setState({ refreshing: false });
            this.reload(this.state.activity.clubKey, this.state.activity.activityKey);
        } catch (error) {
            console.log(error.toString());
        }
    }

    getUserLocation = async () => {
        let location = await Location.getCurrentPositionAsync();

        this.setState({
            region: {
                latitude: location.coords.latitude, //緯度
                longitude: location.coords.longitude, //經度
                latitudeDelta: 0.003, //經度縮放比例
                longitudeDelta: 0.003, //緯度縮放比例
            }
        })
    }

    //過門
    activityOverLayar = () => {
        this.setState({ loading: !this.state.loading });
    }

    //設定本頁activity
    setActivity = (activityData) => {
        this.setState({ activity: activityData });
    };

    //點讚
    pressFavorite = async (clubKey, activityKey) => {
        const { setActivityFavorite, activityList, setActivityList } = this.props;
        this.activityOverLayar();
        const activityData = await setActivityFavorite(clubKey, activityKey);
        this.activityOverLayar();
        if (activityData != null) {
            //放進activityList
            const newActivityList = JSON.parse(JSON.stringify(activityList));
            newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
            setActivityList(newActivityList);
            this.setState({ activity: activityData });
        }
    };

    open = async () => {
        let location = await Location.getCurrentPositionAsync();
        console.log(location)
        showLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            // title: '活動地點',  // optional
            dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
            dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you li
            cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
            appsWhiteList: ['google-maps', 'apple-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
            app: 'google-maps'  // optionally specify specific app to use
        })
    }
    //點擊收藏
    pressKeep = async (activity) => {
        const { setActivityKeep, activityList, setActivityList } = this.props;
        this.activityOverLayar();
        const activityData = await setActivityKeep(activity.clubKey, activity.activityKey);
        this.activityOverLayar();
        if (activityData != null) {
            //放進activityList
            const newActivityList = JSON.parse(JSON.stringify(activityList));
            newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
            setActivityList(newActivityList);
            this.setState({ activity: activityData });
        }
    }

    //頁面重整
    reload = async (clubKey, activityKey) => {
        const { getInsideActivity, navigation, activityList, setActivityList } = this.props;
        this.activityOverLayar();
        const newActivity = await getInsideActivity(clubKey, activityKey);
        this.activityOverLayar();
        const newActivityList = JSON.parse(JSON.stringify(activityList));
        if (newActivity == null) {
            newActivityList[clubKey][activityKey] = null;
            delete newActivityList[clubKey][activityKey];
            setActivityList(newActivityList);
            navigation.goBack();
        } else {
            newActivityList[clubKey][activityKey] = newActivity;
            setActivityList(newActivityList);
            this.setState({ activity: newActivity });
        }
    };

    

    render() {
        const activityData = this.state.activity;
        const element = JSON.parse(JSON.stringify(activityData));
        const { startDateTime, endDateTime } = element
        const _startDateTime = convertDateFormat(startDateTime)
        const _endDateTime = convertDateFormat(endDateTime)
        return (
            <View style={[styles.container, { flex: 1 }]}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            tintColor='#f6b456'
                        />
                    }
                >
                    <View style={styles.main}>
                        <View style={styles.clubBackground} >
                            <Image
                                source={{ uri: element.photo }}
                                resizeMode='cover'
                                style={styles.clubBackground} />
                        </View>
                    </View>
                    <View style={styles.main}>
                        <View style={styles.main}>
                            <View style={[styles.clubTextView, { flex: 1 }]}>
                                <Text style={styles.schoolText}>{element.schoolName}    {element.clubName}</Text>
                                <TouchableOpacity onPress={async () =>
                                    await this.pressKeep(element)}>


                                    <Image
                                        style={styles.collect}
                                        source={element.statusKeep ? require("../../images/bookmark-yellow.png") : require("../../images/bookmark-gray.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.clubTextView]}>
                                <Text style={styles.actText}>{element.title}</Text>
                                <TouchableOpacity style={styles.like}
                                    onPress={async () =>
                                        await this.pressFavorite(element.clubKey, element.activityKey)}>
                                    <Image
                                        style={styles.titleLikesView}
                                        source={element.statusFavorite ? require("../../images/like-orange.png") : require("../../images/like-gray.png")}
                                    />
                                    <Text style={styles.number}>{element.numFavorites}</Text>
                                </TouchableOpacity>


                            </View>
                        </View>

                        <View style={styles.main}>
                            <View style={styles.summaryTextView}>
                                <Image source={require('../../images/calendar.png')}
                                    style={styles.icon} />
                                <Text style={[styles.summaryText, style = { marginRight: 1 }]}>{_startDateTime}</Text>
                                <Text style={styles.toText}>~</Text>
                                <Text style={[styles.summaryText, style = { marginLeft: 1 }]}>{_endDateTime}</Text>
                            </View>
                            <View style={styles.summaryTextView}>
                                <Image source={require('../../images/coin.png')}
                                    style={styles.icon} />
                                <Text style={styles.summaryText}>{element.price}</Text>
                            </View>
                            <View style={styles.summaryTextView}>
                                <Image source={require('../../images/place.png')}
                                    style={styles.icon} />
                                <Text style={styles.summaryText}>{element.place}</Text>
                            </View>
                        </View>
                    </View>
                    {
                        // <View style={styles.main}>
                        //     <MapView
                        //         style={{ height: 250, marginLeft: 20, marginTop: 10, marginRight: 20 }}
                        //         region={this.state.region}>
                        //         <Marker
                        //             coordinate={{
                        //                 latitude: this.state.region.latitude,
                        //                 longitude: this.state.region.longitude,
                        //             }}
                        //             title='你現在的位置'
                        //             description='在此位置辦活動'
                        //         />
                        //     </MapView>
                        // </View>
                    }
                    
                    <View style={styles.main}>
                        <View style={styles.divide}>
                            <Text style={styles.titleText}>活動內容</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>{element.content}
                            </Text>

                        </View>
                        <View style={styles.divide}>
                            <Text style={styles.titleText}>備註</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>{element.remarks}
                            </Text>

                        </View>
                    </View>
                
                </ScrollView>
                {this.state.loading ? <Overlayer /> : null}
            </View>
        )
    }
}

export default Activity;
