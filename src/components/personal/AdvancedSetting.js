import React from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/personal/AdvancedSetting'

class AdvancedSetting extends React.Component {

    render() {
        const { user, loginType } = this.props
        return (
        <View style={styles.container}>
            <View style={styles.containView}>
                <TouchableOpacity style={styles.boxView} onPress={() => this.props.navigation.navigate('EmailReVerified')}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={styles.boxFirstText}>驗證</Text> 
                        <Text style={styles.redText}>{user.emailVerified ? '(已驗證)' : '(未驗證)'}</Text> 
                    </View>
                    <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Text style={styles.mailText}>{this.props.user.email}</Text>
                        <TouchableOpacity
                            disabled={user.emailVerified}
                            style={{marginLeft: 5}}
                            onPress={() => this.props.navigation.navigate('EmailReVerified')}>
                            <Image source={require('../../images/arrowRight.png')} style={styles.arrowRight}/>
                        </TouchableOpacity>
                    </View>                
                </TouchableOpacity>

                <TouchableOpacity style={styles.boxView} disabled={loginType != 'normal'} onPress={() => this.props.navigation.navigate('ChangeEamil')}>
                    <Text style={styles.boxText}>電子信箱</Text>
                    {
                        loginType == 'normal' ? (
                            <TouchableOpacity
                                disabled={loginType != 'normal'}
                                onPress={() => this.props.navigation.navigate('ChangeEamil')}>
                                <Image source={require('../../images/arrowRight.png')} style={styles.arrowRight}/>    
                            </TouchableOpacity>
                        ) : null
                    }
                </TouchableOpacity>


                <TouchableOpacity style={styles.boxBottomBorderView} disabled={loginType != 'normal'} onPress={() => this.props.navigation.navigate('ChangePassword')}>
                    <Text style={styles.boxText}>密碼</Text> 
                    {
                        loginType == 'normal' ? (
                            <TouchableOpacity
                                disabled={loginType != 'normal'}
                                onPress={() => this.props.navigation.navigate('ChangePassword')}>
                                <Image source={require('../../images/arrowRight.png')} style={styles.arrowRight}/>
                            </TouchableOpacity>
                        ) : null
                    }
                </TouchableOpacity>

                {/* <View style={styles.boxView}>
                    <Text style={styles.boxText}>關於我們</Text>  
                </View> */}
            </View>   
        </View> 
        );
    }
}


export default AdvancedSetting
