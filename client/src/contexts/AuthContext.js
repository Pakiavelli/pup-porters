import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import axios from 'axios';

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState()

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }


  function getUserInfo() {
    console.log(JSON.stringify(currentUser.uid))
    axios.get('/user', {
      params: {
        uid: JSON.stringify(currentUser.uid)
      }
    })
    .then(response => {
      setUserInfo(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)

    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (currentUser) {
      axios.get(`/user/${currentUser.uid}`)
        .then(response => {
          setUserInfo(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [currentUser])

  const value = {
    currentUser,
    userInfo,
    login,
    signup,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}