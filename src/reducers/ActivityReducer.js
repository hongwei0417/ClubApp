import { 
    GET_ACTIVITYLIST,
    GET_ACTIVITY,
    GET_SETACTIVITYLIST,
    GET_SETACTIVITY,
    CLEAR_ACTIVITY 
} from '../actions/ActivityAction'

const initialState = {
    activityList: {},//每個tab活動列
    activity: {},//每個tab單篇活動
    setActivityList: {},//每個tab活動列setState
    setActivity: {},//每個tab活動setState
}
export const activityReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ACTIVITYLIST:
            return {
                ...state,
                activityList: action.activityList
            }
        case GET_ACTIVITY:
            return {
                ...state,
                activity: action.activity
            }
        case GET_SETACTIVITYLIST:
            return {
                ...state,
                setActivityList: action.setActivityList
            }
        case GET_SETACTIVITY:
            return {
                ...state,
                setActivity: action.setActivity
            }
        case CLEAR_ACTIVITY:
            return initialState
        default:
            return state
    }
}