import { getAuth, GithubAuthProvider } from 'firebase/auth';

class AuthLogic {
  constructor() {//생성자함수 - 바닐라에서는 같은 이름함수를 지원하지 않음
    this.auth = getAuth();
    this.gitProvider = new GithubAuthProvider();
  }
  getUserAuth = () => {
    return this.auth;
  };
} //end of AthLogic
export default AuthLogic;//index.js에서 참조할 수 있도록 export하였다 - module - ES6

//로그아웃 버튼 클릭시 호출하기
export const logout =  auth => {
  console.log('logout');
  return new Promise((resolve, reject) => {
      //로그아웃 처리하기
      auth.signOut().catch(e =>  reject(alert(e+": 로그아웃 오류입니다.")));
      //localStorage.removeItem("userId")
      localStorage.clear()
      resolve()
  })
}//end of logout

export const onAuthChange = (auth) => {
  return new Promise((resolve) => {
    //로그인 함수가 풀렸는지 체크하여 콜백함수에 파라미터로
    //사용자 정보를 쥐어 줌
    auth.onAuthStateChanged((user) => {
      resolve(user)
    })
  })
}