export function handleLoginDataChange(loginUser){
    return(dispatch)=>{
        dispatch({
            type:'HANDLE_LOGINDATA_CHANGE',
            payload:loginUser
        }) 
    }
}
export function handleRagisterDataChange(ragisterUser){
    return(dispatch)=>{
        dispatch({
            type:'HANDLE_RAGISTERDATA_CHANGE',
            payload:ragisterUser
        }) 
    }
}

export function handleForgotPasswordChange(changePasswordEmail){
    return(dispatch)=>{
        dispatch({
            type:'HANDLE_FORGOT_PASSWORD_CHANGE',
            payload:changePasswordEmail
        }) 
    }
}

export function handleTextBoxChange(message){
    return(dispatch)=>{
        dispatch({
            type:'HANDLE_MESSAGE_CHANGE',
            payload:message
        }) 
    }
}

export function handleMessageListChange(messages){
    return(dispatch)=>{
        dispatch({
            type:'HANDLE_MESSAGE_LIST_CHANGE',
            payload:messages
        }) 
    }
}
