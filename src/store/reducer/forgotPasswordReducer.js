const INITIAL_STATE={
    changePasswordEmail:''
}
export default(states=INITIAL_STATE,action)=>{
    switch(action.type){
        case 'HANDLE_FORGOT_PASSWORD_CHANGE':
            return({
                ...states,
                changePasswordEmail:action.payload
            })
        default:
            return states;
    }
}