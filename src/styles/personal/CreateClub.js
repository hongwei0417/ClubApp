import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    title: {
        color: 'rgba(102,102,102,1)',
        fontSize: 20,
        alignSelf: 'center',
        margin: 40
    },
    Q: {
        color: 'rgba(102,102,102,1)',
        fontSize: 20,
        alignSelf: 'center',
        margin:5
    },
    textInput: {
        marginBottom: 25,
        width: 200,
        height: 40,
        color: 'rgba(102,102,102,1)',
        backgroundColor: 'rgba(246,180,86,0.3)',
        borderRadius: 10,
        textAlign: 'center',
        fontSize:15
    },
    nextText: {
        color: 'rgba(102,102,102,0.5)',
        fontSize: 15,
        alignSelf: 'center',
        marginTop: 30

    }
})