const INITIAL_STATE={
    loginUser:''
}
export default(states=INITIAL_STATE,action)=>{
    switch(action.type){
        case 'HANDLE_LOGINDATA_CHANGE':
            return({
                ...states,
                loginUser:action.payload
            })
        default:
            return states;
    }
}