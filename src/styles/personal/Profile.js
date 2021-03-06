import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'rgba(246,180,86,0.2)'
    },
    person: {
        width: 83,
        height: 83,
        borderColor:'transparent',
        borderWidth:1
    },
    circle:{
        width: 83, 
        height: 83, 
        borderRadius: 40, 
        overflow: 'hidden', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: 10
    },
    name: {
        color: '#666666',
        fontSize: 18,
        marginBottom: 5
    },
    row: {
        flexDirection: 'row',
        flex: 1
    },
    rowx:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    hotPoint: {
        height: 16,
        width: 16,
        marginRight: 3,
        marginBottom:6,
    },
    number: {
        color: '#666666',
        fontSize: 15,
        marginBottom:6,
    },
    aboutMe: {
        marginLeft:50,
        marginRight:50,
        marginBottom:5,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        justifyContent: 'center',
        flex: 2.3,
        paddingLeft: 20,
        paddingRight: 20,
    },
    aboutMeText: {
        color: '#666666',
        fontSize: 13,
        alignSelf: 'center'
    },
    botton: {
        marginRight:15,
        marginLeft:15,
        marginBottom:5,
        marginTop:5,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 1,
        borderColor: 'rgba(246,180,86,1)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex:1
    },
    bottonIcon: {
        height: 28,
        width: 28
    },
    bottonText: {
        color: '#666666',
        fontSize: 12,
        marginTop: 7
    },
    signOut: {
        margin: 5,
        marginBottom:10,
        marginTop:10,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 1,
        borderColor: '#f6b456',
        justifyContent: 'center',
        flex:1
    },
    signOutText: {
        color: '#666666',
        fontSize: 16,
        alignSelf: 'center'
    },
    one: {
        flex: 3.8,
        alignItems: 'center',
        justifyContent:'flex-end'
    },
    three: {
        flex: 2.2,
        justifyContent:'center',
        marginLeft:35,
        marginRight:35
    },
    four: {
        flex: 2.2,
        justifyContent:'center',
        marginLeft:35,
        marginRight:35,
    },
    five: {
        flex: 1.1,
        justifyContent:'center',
        marginLeft:45,
        marginRight:45
    }
})