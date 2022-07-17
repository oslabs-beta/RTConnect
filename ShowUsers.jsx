import React, {useContext} from 'react'
import {SocketContext, SocketContextProvider} from './SocketContext.jsx'

const ShowUsers = () => {
    const { users, setUsers } = useContext(SocketContext);
  return (
    <div>Users connected: {users}</div>
  )
}

export default ShowUsers