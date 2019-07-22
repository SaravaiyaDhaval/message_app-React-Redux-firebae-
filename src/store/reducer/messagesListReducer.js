const INITIAL_STATE={
    messages:''
}
export default(states=INITIAL_STATE,action)=>{
    debugger
    switch(action.type){
        case 'HANDLE_MESSAGE_LIST_CHANGE':
            return({
                ...states,
                messages:action.payload
            })
        default:
            return states;
    }
}