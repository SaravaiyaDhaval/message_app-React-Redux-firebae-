import loginUserReducer from './loginUserReducer';
import ragisterUserReducer from './ragisterUserReducer';
import forgotPasswordReducer from './forgotPasswordReducer'
import messageReducer from './messageReducer';
import messagesListReducer from './messagesListReducer';
import {combineReducers} from 'redux';
export default combineReducers(
    {
    loginUserReducer: loginUserReducer,
    ragisterUserReducer: ragisterUserReducer,
    forgotPasswordReducer: forgotPasswordReducer,
    messageReducer: messageReducer,
    messagesListReducer: messagesListReducer,
})