import {USER,REMOVE} from "./action.types";

export const initialState = null;

export const reducer = (state,action) => {
    switch(action.type){
        case USER:
            return action.payload
        case REMOVE:
            return initialState
        default:
            return state
    }
}

// export const initialRoomState = null

// export const roomReducer = (roomstate,action) => {
//     switch(action.type){
//         case CURRENTROOM:
//             return action.payload
//         case REMOVEROOM:
//             return initialRoomState
//         default:
//             return roomstate
//     }
// }
