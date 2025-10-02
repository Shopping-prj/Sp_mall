import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
//이 콤퍼넌트는 화면에 대한 역할은 없다.
//만일 화면에 대한 역할을 부여 한다면 모래시계나 혹은 로딩 중이라는 애니메이션 효과정도...
const KakaoRedirect = () => {
  const navigate = useNavigate()
  console.log('여기....');//타임라인관계, 다시 그려진다(함수가 새로 생성됨.)
  //카카오 등록해둔 Redirect_uri통해서 받은 인카코드를 얻기
  const code = new URL(window.location.href).searchParams.get('code')
  console.log(code);
  //인가코드를 받으면 즉시 8000번 서버에 요청을 보낸다.
  //왜냐면 code가 있어야 accessToken발급되고 이 토큰이 있어야 profile을 받을 수 있다.
  //위 두 가지를 스프링으로 처리한다.
  //이유는 소셜로그인의 경우에 강제로 회원가입을 하기 위해서 이다.
  //8000번으로 요청을 보내는 일은 화면과 상관없이 이 컴포넌트가 렌더링 될 때 즉시 
  //한다. -> useEffect
  //useEffect가 호출되는 시점에 대해서 관찰해 두기 - 업무적인 복잡도 높을 수록 중요
  useEffect(()=> {
    console.log('effect...');
    //비동기 처리 요청할 것이다.
    //비동기 요청 후 응답으로 받은 값은 토큰이어야 한다.
    const authCode = {"code": code}
    const kakaoLogin = async() => {
      const res = await axios({
        method: "post",
        url: "http://localhost:8000/member/kakao/doLogin",
        data: authCode
      })
      console.log(res);
      //아래 두 줄 코드는 개발자가 직접 토큰관리를 할 때 필요한 코드임
      //1-3버전이다. - Naver Oauth 인증 처리한 다음에 해보기
      const token = res.data.token
      localStorage.setItem("token", token)
      navigate("/home")
    }//end of kakaoLogin
    //테스트 : 단위테스트와 통합테스트
    kakaoLogin() //호출은 일단 막아둠 - 인가코드 먼저 확인할 것.
  },[])//end of useEffect
  return (
    <div>Loading....</div>
  )
}

export default KakaoRedirect