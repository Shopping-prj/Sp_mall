import moment from 'moment'
import { useEffect, useState } from 'react'
import { Button, Form, Modal, Table } from 'react-bootstrap'
import Datetime from 'react-datetime'
import { db } from '../../service/firebase'
import { ref, set, onValue, off } from "firebase/database";
import MemoRow from './MemoRow'

//이 페이지가 열리자 마자 Realtimedatabase를 경유한다.

const MemoList = () => {
  const [allMemos, setAllMemos] = useState([]) //원본
  const [gubun, setGubun] = useState('')
  const [keyword, setKeyword] = useState('')
  const [m_start, setM_start] = useState('')
  const [m_end, setM_end] = useState('')
  //오늘 이전 날짜 정보 비활성화기
  const yesterday = moment().subtract(1, 'day')
  const valid = (current) => {
    return current.isAfter(yesterday)
  }
  const [memo, setMemo] = useState({
    m_no: 0,  //식별자 -PK
    m_title: "", //일정명
    m_writer: "", //작성자
    m_content: "", //일정내용
    m_start: "", //시작일자 및 시간
    m_end: ""    //끝일자 및 시간
  })
  //아래 함수는 사용자가 입력 컴포넌트에 값을 입력할 때 마다 
  const handleChangeForm = (event) => {
    event.preventDefault()
    //if문 안에서 return을 만나면 해당 함수를 탈출함
    if(event.target == null) return
    //사용자 입력하여 폼 내용 변경이 발생하면.... 감지
    console.log("폼 내용 변경 발생 : name - "+event.target.name);
    console.log("폼 내용 변경 발생 : value - "+event.target.value);
    //Computed Property Name 문법은 ECMAScript 2015에 추가된 문법
    //대괄호로 감싸면 키값이 된다. 변수를 동적으로 만들어줌 - ES6지원
    //키값 동적 할당
    setMemo({
      ...memo, m_no:Date.now(),
      [event.target.name]: event.target.value
    })
  }
  const handleStart = (date) => {
    console.log(date._d);
    const m_start = moment(date._d).format('YYYY-MM-DD, a h:mm')
    console.log(m_start);
    setM_start(m_start)
  }
  const handleEnd = (date) => {
    const m_end = moment(date._d).format('YYYY-MM-DD, a h:mm')
    console.log(m_end);
    setM_end(m_end)
  }
  const memoAdd = () => {
    const pmemo = {
      m_no: memo.m_no,
      m_title: memo.m_title,
      m_writer: memo.m_writer,
      m_content: memo.m_content,
      m_start: m_start,
      m_end: m_end
    }
    console.log(pmemo);
    //RealtimeDatabase입력 - 실시간으로 변경된 부분이 반영됨
    //database는 firebase.js에 선언된 변수명이다
    set(ref(db, 'memo/'+memo.m_no),pmemo)
    //저장하고 나면 모달창은 닫기
    handleClose()
  }//end of memoAdd
  //검색을 눌렀을 때 - 조건검색 구현하기
  //분류결정하기 - 변한다 - > gubun - useState
  //키워드 입력 - 변한다 -> keyword - useState

  /*
  allMemos.filter(memo => {...})
  allMemos: 전체 메모 목록 배열이다. 
  filter함수는 배열에서 조건에 맞는 요소만 걸러내어 새로운 배열을 만든다. 
  - gubun : 일정명 or 작성자 or 내용
  memo[gubun] : 일정명-> memo["m_title"], 작성자 -> memo["m_writer"]
  return val.includes(keyword)
  - 포함되어 있다면 true
  - 포함되어 있지 않으면 false
  */
  const memoSearch = () => {//검색 버튼을 클릭했을 때
    console.log(allMemos);
    //분류/검색어가 비어 있으면
    if(!gubun || !keyword){//분류가 바뀌면, 또는 키워드 바뀌었을 때 처리
      setMemos(allMemos)
      return //memoSearch함수를 빠져나간다
    }//end of if
    // gubun: m_title | m_writer | m_content
    const filtered = allMemos.filter(memo => {
      console.log(memo);
      const val = (memo[gubun] ?? '').toString().toLowerCase()
      return val.includes(keyword)
    })
    //setMemos(filtered)
  }//end of memoSearch
  const handleGubun = (e) => {
    setGubun(e.target.value) //m_title, m_writer, m_content
  }
  const handleKeyword = (e) => {
    setKeyword(e.target.value)
  }
  const [memos, setMemos] = useState([])
  useEffect(()=>{
    getMemoList()
  },[])
  //전체조회 버튼
  const getMemoList = () => {
    //insert here
    console.log('getMemoList호출');
    //RealtimeDatabase에서 memo라는 경로를 참조한다.
    //여기에 참조객체가 starCountRef
    const starCountRef = ref(db, 'memo');
    //onValue함수에서 두번째 파라미터는 콜백함수- 익명함수
    //memo객체가 변경될때 마다 호출됨
    //snapshot은 현재 memo가 가리키는 데이터 상태를 담은 객체
    onValue(starCountRef, (snapshot) => {
      //snapshot.val(): 데이터 값(JSON)을 가져옴
      const data = snapshot.val();
      //출력해봄 -> setMemos([]) 초기화해줌
      console.log(data);
      //insert here
      setAllMemos(data)
      setMemos(data) // React stat업데이트 -> 화면 다시 그려진다.
    });//end of onValue
    // cleanup함수 - 컴포넌트가 화면에서 사라질 때 리스너 해제해줌 - 후처리
    return () => off(starCountRef) //구독 해제    
  }//end of getMemoList
  //모달 관련 선언
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  return (
    <>
      <div className="container">

        <div className="page-header">
          <h2>일정관리 <small>일정목록</small></h2>
          <hr />
        </div>

        <div className="row">
          <div className="col-3">
            <select id="gubun" className="form-select" aria-label="분류선택"
              value={gubun} onChange={handleGubun}
            >
              <option value="">분류선택</option>
              <option value="m_title">일정명</option>
              <option value="m_writer">작성자</option>
              <option value="m_content">내용</option>
            </select>
          </div>
          <div className="col-6">
            <input
              type="text"
              id="keyword"
              value={keyword} onChange={handleKeyword}
              onKeyDown={e => {
                if(e.key === 'Enter'){
                  memoSearch()
                }
              }}
              className="form-control"
              placeholder="검색어를 입력하세요"
              aria-label="검색어를 입력하세요"
              aria-describedby="btn_search"
            />
          </div>
          <div className="col-3">
            <Button variant="danger" type='button' onClick={memoSearch}>
              검색
            </Button>
          </div>
        </div>

        <div className="book-list">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>일정명</th>
                <th>작성자</th>
                <th>일정시간</th>
              </tr>
            </thead>
            <tbody>
            {memos &&
              Object.keys(memos).map((key, index) => (
                <MemoRow key={index} memo={memos[key]} />
            ))}
            </tbody>
          </Table>
          <hr />
          <div className="booklist-footer">
            <Button variant="warning" type='button' onClick={getMemoList}>
              전체조회
            </Button>
            &nbsp;
            <Button variant="success" type='button' onClick={handleShow}>
              글쓰기
            </Button>
          </div>
        </div>
      </div>        

  {/* ========================== [[  일정등록 Modal ]] ========================== */}
      <Modal show={show} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>새로운 일정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form id="f_memo">         
            <Form.Group className="mb-3 row" controlId="mTitle">
              <Form.Label className="col-sm-2 col-form-label">일정명</Form.Label>
              <div className='col-sm-10'>
              <Form.Control className='form-control form-control-sm' type="text" name="m_title" onChange={handleChangeForm} placeholder="Enter 일정명" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="boardWriter">
              <Form.Label className="col-sm-2 col-form-label">등록자</Form.Label>
              <div className='col-sm-10'>
              <Form.Control type="text" name="m_writer" onChange={handleChangeForm} className='form-control form-control-sm' placeholder="Enter 작성자" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="edit-start">
              <Form.Label className="col-sm-2 col-form-label">시작</Form.Label>
              <div className='col-sm-10'>
              <Datetime dateFormat='YYYY-MM-DD' isValidDate={valid} name="m_start" onChange={handleStart}/>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="edit-end">
              <Form.Label className="col-sm-2 col-form-label">끝</Form.Label>
              <div className='col-sm-10'>
              <Datetime dateFormat='YYYY-MM-DD' isValidDate={valid} name="m_end" onChange={handleEnd}/>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="boardContent">
              <Form.Label className="col-sm-2 col-form-label">내용</Form.Label>
              <div className='col-sm-10'>
              <textarea className="form-control" name='m_content' onChange={handleChangeForm} rows="3"></textarea>
              </div>
            </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              닫기
            </Button>
            <Button variant="primary" onClick={memoAdd}>
              저장
            </Button>
          </Modal.Footer>
        </Modal>     
      {/* ========================== [[ 일정등록 Modal ]] ========================== */} 

    </>
  )
}

export default MemoList