let users = [];

const addUser = ({id,name,room}) => {
    const existingUser = users.find((user)=> user.id===id && user.room===room);

    if(existingUser){
        return {error : "User already in this room!"}
    }

    const newuser = {
        id,
        name,
        room
    }

    users.push(newuser);
    return newuser;
}

const removeUser = (id) => {
    const userindex = users.findIndex((user)=>user.id===id);

    if(userindex!==-1){
        return users.splice(userindex,1)[0]
    }   
}

const getUser = (id) => users.find((user)=>user.id===id);

module.exports = {addUser,removeUser,getUser};