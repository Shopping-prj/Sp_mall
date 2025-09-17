import React, { useState } from 'react'
import { DividerDiv, DividerHr, DividerSpan, GoogleButton, KakaoButton, LoginForm, MyH1, MyInput, MyLabel, MyP, NaverButton, PwEye, SubmitButton } from '../styles/FormStyles'
import { Link } from 'react-router-dom'
import axios from 'axios'

const LoginView = () => {
    const [tempUser, setTempUser] = useState({
        m_email: '',
        m_password:''
    })
    const changeUser = (e) => {
        const id = e.currentTarget.id 
        const value = e.target.value 
        setTempUser({...tempUser, [id]: value})
    }
    //동일한 input type=text를 이메일인 경우에는 입력값을 노출하고 비번일 때는 히든 처리해야 함.
    const [passwordType, setPasswordType] = useState({
        type: 'password', 
        visible: false
    })
    const loginG = async() => {
        console.log('구글 로그인');
        const googleUrl = "https://accounts.google.com/o/oauth2/auth"
        const googleClientId = "534475116931-6nr3fu9g1turp8a55i86vfkepts3b7nf.apps.googleusercontent.com"
        const googleRedirectUrl = "http://localhost:3000/oauth/google/redirect"
        const googleScope = "openid profile email"
        try {
            const auth_uri = `${googleUrl}?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&response_type=code&scope=${googleScope}`
            console.log(auth_uri);
            window.location.href=auth_uri
        } catch (error) {
            console.error("구글 로그인 실패!!!", error);
        }


    }
    const loginK = async () => {
        console.log('카카오로그인');
        const kakaoUrl = "https://kauth.kakao.com/oauth/authorize"
        const kakaoClientId = "4b140cf1d4428a43b2d0318382e7b264"
        const kakaoRedirectUrl = "http://localhost:3000/oauth/kakao/redirect"
        try {
            // 카카오 인증 코드 가져오기
            const auth_uri = `${kakaoUrl}?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&response_type=code`
            //브라우저 없이도 요청을 할 수 있다.
            //카카오에서는 oauth/kakao/redirect URL로 응답을 내려줌 -> 리액트 Router이름으로 등록
            window.location.href=auth_uri
        } catch (error) {
            console.error("카카오 로그인 실패!!!", error);
        }//end of try...catch....
    }// end of loginK
    const loginN = async () => {
        console.log('네이버 로그인');
    }
    const passwordView =(e) => {
        const id = e.currentTarget.id 
        if(id === "password"){
            if(!passwordType.visible){
                //<input type=text />
                setPasswordType({...passwordType, type:'text', visible: true})
            }else{
                //<input type=password />
                setPasswordType({...passwordType, type:'password', visible: false})
            }
        }
    }
    const [submitBtn, setSubmitBtn] = useState({
        disabled: true, 
        bgColor: 'rgb(175, 210, 244)',
        hover: false
    })    
    const toggleHover =() => {
        if(submitBtn.hover){
            setSubmitBtn({...submitBtn, hover:false, bgColor:'rgb(105,175,245)'})
        }else{
            setSubmitBtn({...submitBtn, hover:true, bgColor:'rgb(58,129,200)'})
        }
    }    
const loginE = async () => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_SPRING_IP}/api/members/login`,
            {
                email: tempUser.m_email,
                password: tempUser.m_password
            },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const member = response.data;
        console.log("로그인 성공:", member);
        localStorage.setItem("loginMember", JSON.stringify(member));
        window.location.href = "/home";
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "로그인 실패");
    }
}
  return (
    <>
        <LoginForm>
        <MyH1>로그인</MyH1>
        <MyLabel htmlFor="email"> 이메일     
            <MyInput type="email" id="mem_email" name="mem_email" placeholder="이메일를 입력해주세요." 
            onChange={(e)=>changeUser(e)}/>   
        </MyLabel>
        <MyLabel htmlFor="password"> 비밀번호
            <MyInput type={passwordType.type} autoComplete="off" id="mem_pw" name="mem_password" placeholder="비밀번호를 입력해주세요."
            onChange={(e)=>changeUser(e)}/>
            <div id="password" onClick={(e)=> {passwordView(e)}} style={{color: `${passwordType.visible?"gray":"lightgray"}`}}>
            <PwEye className="fa fa-eye fa-lg"></PwEye>
            </div>
        </MyLabel>
        <SubmitButton type="button" style={{backgroundColor:submitBtn.bgColor}}  
            onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={loginE}>
            로그인
        </SubmitButton>
        <DividerDiv>
            <DividerHr />
            <DividerSpan>또는</DividerSpan>
        </DividerDiv>
        <GoogleButton type="button" onClick={loginG}>
            <i className= "fab fa-google-plus-g" style={{color: "red", fontSize: "18px"}}></i>&nbsp;&nbsp;Google 로그인
        </GoogleButton>
        <KakaoButton type="button" onClick={loginK}>
            Kakao 로그인
        </KakaoButton>
        <NaverButton type="button" onClick={loginN}>
            Naver 로그인
        </NaverButton>
        <MyP style={{marginTop:"10px"}}>신규 사용자이신가요?&nbsp;<Link to="/api/members/join" className="text-decoration-none" style={{color: "blue"}}>계정 만들기</Link></MyP>
        <MyP>이메일를 잊으셨나요?&nbsp;<Link to="/login/findEmail" className="text-decoration-none" style={{color: "blue"}}>이메일 찾기</Link></MyP>
        <MyP>비밀번호를 잊으셨나요?&nbsp;<Link to="/login/resetPwd" className="text-decoration-none" style={{color: "blue"}}>비밀번호 변경</Link></MyP>
        </LoginForm>      
    </>
  )
}

export default LoginView