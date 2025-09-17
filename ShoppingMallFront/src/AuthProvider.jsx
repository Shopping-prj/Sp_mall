import React from 'react'
import { Navigate } from 'react-router-dom';

const AuthProvider = ({children}) => {
  //엑세스 토큰 확인하기
  const accessToken = window.localStorage.getItem("accessToken");
  if(!accessToken){
    return <Navigate to="/" />
  }
  return children
}

export default AuthProvider