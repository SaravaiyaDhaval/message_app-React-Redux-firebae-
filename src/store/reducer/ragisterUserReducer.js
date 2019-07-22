const INITIAL_STATE={
    ragisterUser:''
}
export default(states=INITIAL_STATE,action)=>{
    switch(action.type){
        case 'HANDLE_RAGISTERDATA_CHANGE':
            return({
                ...states,
                ragisterUser:action.payload
            })
        default:
            return states;
    }
}