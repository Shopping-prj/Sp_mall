import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
/*
구글 서버에서 응답으로 보내주는 URL이 http://localhost:3000/oauth/google/redirect
이다
저 요청을 라우터로 등록한다. -> 콤포넌트가 필요(함수) ->  useEffect -> 화면은 필요없음
왜냐면 바로 즉시 8000번 서버로 다시 요청을 보내야 한다

이 콤퍼넌트는 언제 누가 호출하나요?
힌트는 code를 파라미터로 받아온다. 여기서 code는 인가 코드이다. 
구글 로그인을 했을 때 구글에서 응답을 보낸다. - redirect_uri
이 redirect_uri는 인증과 상관없이 항상 열려있다.
이 콤퍼넌트가 하는 일은 무엇인가요?(화면처리, 로직을 호출한다)
*/
const GoogleRedirect = () => {
  const navigate = useNavigate()
  const code = new URL(window.location.href).searchParams.get('code')

  console.log("code : "+code);
  const params = {"code":code}
  useEffect(()=>{
    const googleLogin = async() => {
      const res = await axios({
        method: "post",
        url: "http://localhost:8000/member/google/doLogin",
        data: params
      })
      //res로 받아오는 것은 마임 타입이 text/plain이고
      //res.data로 받아오는 것은 마임 타입이 application/json
      console.log(res);
      const token = res.data.token  
      console.log(token);
      window.localStorage.setItem("token",token)
      //홈화면으로 리다이렉트하기
      //window.location.href="/"
      //window.location.reload();
      navigate("/home") //-> http://localhost:3000/ -> HomePage
    }
    googleLogin()
  },[])
  return (
    <div>loading...</div>
  )
}

export default GoogleRedirect