import axios from 'axios'
import { useAuth } from 'context/AuthContext'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const KakaoRedirect = () => {
  const navigate = useNavigate()
  const ran = useRef(false)
  const { login } = useAuth()

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const kakaoLogin = async () => {
      try {
        const code = new URL(window.location.href).searchParams.get('code')
        if (!code) { alert('카카오 로그인 인가코드가 없습니다.'); navigate('/login'); return }

        const res = await axios.post('http://localhost:8000/member/kakao/doLogin', { code })
        const { accessToken, refreshToken } = res.data || {}
        if (!accessToken || !refreshToken) { alert('토큰이 없습니다.'); navigate('/login'); return }

        login({ accessToken, refreshToken })
      } catch (err) {
        console.error('카카오 로그인 실패:', err)
        alert(err?.response?.data?.message || '카카오 로그인 실패')
        navigate('/login')
      }
    }

    kakaoLogin()
  }, [navigate, login])

  return <div>Loading....</div>
}

export default KakaoRedirect
