import styled from 'styled-components';

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  max-width: 450px;
  width: 30%;
  min-width: 350px;
  padding: 20px 30px 20px 30px;
  border-radius: 30px;
  margin: 30px 0px 30px 0px;
  border: 2px solid lightgrey;
`;

export const SignupForm = styled(LoginForm)`
  padding: 80px 40px 80px 40px;
  max-width : 1000px;
  min-width : 300px;
  width : 90%;
`;

  
export const MyH1 = styled.h1`
  font-size: 38px;
  margin-bottom:30px;
  font-weight: 20px;
  text-align: center;
`;
  
  /* 3번의 하위태그에 대한 설정 */
export const MyP = styled.p`
  font-size: 13px;
`; 
  

export const PwEye = styled.i`
    position: absolute;
    margin-left: 240px;
    margin-top: -25px;
    cursor: pointer;
    &:hover { 
      color: #808080;
    };
`;
  
export const MyLabel = styled.label`
  font-size: 14px;
  color: #414149;
  display: block;
  margin-bottom: 20px;
`; 

export const MyLabelAb = styled(MyLabel)`
  position:absolute;
  color: #85858b;
  font-size: 11px;
`;

export const MyInput = styled.input`
  width: 275px;
  display: block;
  height: 32px;
  border: none;
  border-bottom: 1px solid #dddddd;
  font-size: 15px;
  &:focus, &:hover {
    border-bottom: 2px solid #004fff;
    outline: none;
  } 
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
        -webkit-appearance: none;
  }
  &::placeholder {
    color: lightgray;
    font-size: 13px;
  }
`;
  

export const SubmitButton = styled.button`
  margin-top: 20px;
  width: 275px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 24px;
  margin-bottom: 20px;
  border: 1.5px solid rgb(105, 175, 245);
  color: white;
  cursor: pointer;
`;

export const WarningButton = styled(SubmitButton)`
  border: none;
  background-color: rgb(241, 80, 42);
  color: white;
  &:hover { background-color: rgb(200, 34, 18) }
`;

export const GoogleButton = styled(SubmitButton)`
  margin-top: 0px;
  background-color: white;
  font-weight: bold;
  border: 1px solid #dddddd;
  color: black;
  &:hover { background-color: lightgray }
`; 

export const KakaoButton = styled(SubmitButton)`
  margin-top: 0px;
  background-color: #FEE500;
  font-weight: bold;
  border: 1px solid #dddddd;
  color: black;
  &:hover { background-color: lightgray }
`; 

export const NaverButton = styled(SubmitButton)`
  margin-top: 0px;
  background-color: #00fe1eff;
  font-weight: bold;
  border: 1px solid #dddddd;
  color: black;
  &:hover { background-color: lightgray }
`; 

export const MyButton = styled.button`
  margin-top:10px;
  margin-bottom: 0px; 
  background-color: white; 
  color: black;
  border-radius: 15px;
  font-size: 14px;
  border: 1px solid lightgray;
  width: 75px;
  &:hover { background-color: lightgray }
`;
  
  /* submit버튼에 float를 주면 밀리는데 clear:both로 해결 */
export const DividerDiv = styled.div`
  position: relative;/* hr선이 화면 안으로 들어옴 */
  clear: both;
  text-align: center;/* 문자또는 문자열을 가운데 정렬 */
  width: 100%;
  margin-bottom: 20px;
`; 
  
export const DividerHr = styled.hr`
  position: absolute;/* hr선이 밀려나는데 부모인 divider에 relative를 줌 */
  width: 100%;
  height: 1px;
  border: none;
  background-color: #535353;
`;
  
export const DividerSpan = styled.span`
  position: relative;
  display: inline-block;
  margin-top: 5px;
  padding: 0 10px;
  color: #4b4b4b;
  background-color: white;
`;



export const BButton = styled.button`
  border-radius: 10px;
  border: 1px solid white;
  background-color: rgb(105, 175, 245);
  color: white;
  width:80px;
  height:38px;
  font-weight: bold;
  &:hover { background-color: rgb(58, 129, 200)}
`;


export const ContainerDiv = styled.div`
display: flex;
flex-direction: column; 
width: 100%;
align-items: center;
margin: 50px 0px 50px 0px;
`


export const FormDiv = styled.div`
display: flex;
flex-direction: column; 
width: 90%;
border: 2px solid lightGray;
border-radius: 20px;
padding: 10px;
max-width: 1200px;
min-height: 650px;
justify-content: space-between;
`


export const HeaderDiv = styled.div`
display: flex;
width: 90%;
max-width: 1200px;
justify-content: space-between;
margin-bottom:10px;
`


export const QnACommentArea = styled.textarea`
width:100%;
height:100px;
resize:none;
border:1px solid lightgray;
border-radius:10px;
padding:5px;
`

export const CommentArea = styled.textarea`
width:100%;
height:200px;
resize:none;
border:1px solid lightgray;
border-radius:10px;
padding:5px;
`

export const PayForm = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
max-width:400px;
padding: 20px;
width: 100%;
margin:40px 10px 40px 10px;
border: 1px solid lightgray;
border-radius:30px;
`


export const SpanA = styled.span`
  cursor: pointer;
  font-weight: bold;
  color: rgb(105, 175, 245);
  &:hover { color : rgb(58, 129, 200)}
`