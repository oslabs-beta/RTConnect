import React, { createContext, useState, useEffect } from "react";

// create context
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    // the value that will be given to the context
    const [users, setUsers] = useState([]);
    const getUsers = (data) => {
      console.log('im getting invoked');
      const userList = data.payload.map(name => (
        <div>{name}</div>
      ))
      setUsers(userList);
    }
    const providerValue = {
      users,
      setUsers,
      getUsers,
  };
  return(
    <UserContext.Provider value={providerValue}>
        {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserContextProvider }