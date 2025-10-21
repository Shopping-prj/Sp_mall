import axios from 'axios'
import { useAuth } from 'context/AuthContext'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const GoogleRedirect = () => {
  const navigate = useNavigate()
  const ran = useRef(false)
  const { login } = useAuth()

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const googleLogin = async () => {
      try {
        const code = new URL(window.location.href).searchParams.get('code')
        if (!code) { alert('구글 로그인 인가코드가 없습니다.'); navigate('/login'); return }

        const res = await axios.post('http://localhost:8000/member/google/doLogin', { code })
        const { accessToken, refreshToken } = res.data || {}
        if (!accessToken || !refreshToken) { alert('토큰이 없습니다.'); navigate('/login'); return }

        // 이메일 로그인과 동일 규약으로 저장+라우팅
        login({ accessToken, refreshToken })
      } catch (err) {
        console.error('구글 로그인 실패:', err)
        alert(err?.response?.data?.message || '구글 로그인 실패')
        navigate('/login')
      }
    }

    googleLogin()
  }, [navigate, login])

  return <div>loading...</div>
}

export default GoogleRedirect
