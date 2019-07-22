const INITIAL_STATE={
    message:''
}
export default(states=INITIAL_STATE,action)=>{
    switch(action.type){
        case 'HANDLE_MESSAGE_CHANGE':
            return({
                ...states,
                message:action.payload
            })
        default:
            return states;
    }
}