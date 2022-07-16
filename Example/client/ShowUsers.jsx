import React, {useContext} from 'react'
import {UserContext, UserContextProvider} from './UserContext.jsx'

const ShowUsers = () => {
    const { users, setUsers } = useContext(UserContext);
  return (
    <div>Users connected: {users}</div>
  )
}

export default ShowUsers