import { onValue, ref, remove, set } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { db } from '../../service/firebase';
import { Button, Card, Form, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import Header from '../include/Header';
import Footer from '../include/Footer';
import Datetime from 'react-datetime'
import moment from 'moment';
/*
MemoDetail.jsx에는 두 개의 화면이 있습니다. 
하나는 상세보기 화면이고
다른 하나는 모달  화면이다 - 단 모달은 hide되어 있다. 

상세보기는 언제 일어나는가? - 시점 -> 값을 쥐고 있다 or 잃어버렸다. 
/memo/detail/5 -> Realtimedatabase경유 -> 한 건을 쥔다 -> useState초기화

삭제버튼 -> 5번이 삭제됨
useEffect는 m_no가 변하지 않으면 다시 실행되지 않아
memo가 아무것도 참조하지 못하고 있다. 
그런데 아직도 모달에서는 memo.m_title
*/
const MemoDetail = () => {
  const navigate = useNavigate()
  console.log('11');
  const { m_no } = useParams()
  console.log(m_no);
  //오늘 이전 날짜 정보 비활성화기
  const yesterday = moment().subtract(1, 'day')
  const valid = (current) => {
    return current.isAfter(yesterday)
  }  
  const [m_start, setM_start] = useState('')
  const [m_end, setM_end] = useState('')
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

  const [memo, setMemo] = useState({})
  useEffect(()=> {
    console.log('effect');
    const starCountRef = ref(db, `memo/${m_no}`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);    
      setMemo(data)
    })
  },[m_no])
  //수정하기
  const memoUpdate = () => {
    const pmemo = {
      m_no: m_no,
      m_title: memo.m_title,
      m_writer: memo.m_writer,
      m_content: memo.m_content,
//m_start는 훅이고 memo.m_start는 DB에서 가져온 값을 쥐고 있다.
//NoSQL에서 insert와 update는 내부적으로 처리는 방법이 같다
//여기서 update는 오라클 처럼 있는 정보 중 일부만 수정하는 방법이 아니라
//기존에 값을 삭제하고 새로 쓴다
//데이터 수집을 크롤링으로 한다. -> 영속성 보장 -> NoSQL
//결론: 시작과 끝을 수정하지 않으면 그 컬럼에 값을 삭제되어 있다. -why???      
      m_start: m_start ? m_start: memo.m_start,
      m_end: m_end ? m_end: memo.m_end,
    }//end of pmemo - 새로 입력한 정보 담김
    //주의할것 - 수정을 원치않을 경우에는 반드시 DB에서 꺼낸값을 매핑해준다.
    //이걸 안하면 null들어 간다
    //m_no는 useParams로 가져온 값이고 memo.m_no는 DB에서 꺼낸값이다.
    //-> http://localhost:3000/memo/detail/5
    set(ref(db, 'memo/'+m_no),pmemo)
    //저장하고 나면 모달창은 닫기
    handleClose()    
  }//end of memoUpdate
  //삭제하기
  const memoDelete = () => {
    remove(ref(db, `/memo/${m_no}`))
    //navigate는 url만 변경된다. -> 새로운 요청이 일어나는 것이 아니다.
    //SPA - 부분 갱신처리가 된다.
    //리얼타입이다 -> useState -> 값이 변하면(삭제) -> 다시 그린다.
    //navigate ->  url변경됨 -> memo.m_no -> 삭제 -> memo -> undefined
    //리액트에서는 데이터와 UI분리해서 생각할 수 없다. -> 데이터를 useState관리한다.
    navigate("/memo") //window.location.href과는 다르다
    
  }
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
  //모달 관련 선언
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)  
  return (
    <>
      <Header />
      <div className="container">
        <div className="page-header">
          <h2>일정관리 <small>일정목록</small></h2>
          <hr />
        </div>
        <Card style={{ width: "58rem" }}>
          <Card.Header>{memo?.m_title||''}</Card.Header>
          <ListGroup className="list-group-flush">
            <ListGroupItem>{memo?.m_writer||''}</ListGroupItem>
            <ListGroupItem>{`${memo?.m_start||''} ~ ${memo?.m_end||''}`}</ListGroupItem>
            <ListGroupItem>{memo?.m_content||''}</ListGroupItem>
          </ListGroup>
          <div className="detail-link">
            <Button variant="primary" onClick={handleShow}>
              수정
            </Button>
            &nbsp;
            <Button variant="primary" onClick={memoDelete}>
              삭제
            </Button>
            <Link to="/memo" className="nav-link">
              일정목록
            </Link>
          </div>
        </Card>
      </div>
      <Footer />

  {/* ========================== [[  일정수정 Modal ]] ========================== */}
      <Modal show={show} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>일정 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form id="f_memo">         
            <Form.Group className="mb-3 row" controlId="mTitle">
              <Form.Label className="col-sm-2 col-form-label">일정명</Form.Label>
              <div className='col-sm-10'>
              <Form.Control className='form-control form-control-sm' type="text" 
              name="m_title" onChange={handleChangeForm} 
              value={memo?.m_title||''}
              placeholder="Enter 일정명" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="boardWriter">
              <Form.Label className="col-sm-2 col-form-label">등록자</Form.Label>
              <div className='col-sm-10'>
              <Form.Control type="text" name="m_writer" value={memo?.m_writer||''}
              onChange={handleChangeForm} className='form-control form-control-sm' placeholder="Enter 작성자" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="edit-start">
              <Form.Label className="col-sm-2 col-form-label">시작</Form.Label>
              <div className='col-sm-10'>
              <Datetime dateFormat='YYYY-MM-DD' isValidDate={valid}
              value={memo?.m_start||''}
              name="m_start" onChange={handleStart}/>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="edit-end">
              <Form.Label className="col-sm-2 col-form-label">끝</Form.Label>
              <div className='col-sm-10'>
              <Datetime dateFormat='YYYY-MM-DD' isValidDate={valid} 
              value={memo?.m_end||''}
              name="m_end" onChange={handleEnd}/>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="boardContent">
              <Form.Label className="col-sm-2 col-form-label">내용</Form.Label>
              <div className='col-sm-10'>
              <textarea className="form-control" name='m_content' 
              onChange={handleChangeForm} rows="3">
              {memo?.m_content||''}  
              </textarea>
              </div>
            </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              닫기
            </Button>
            <Button variant="primary" onClick={memoUpdate}>
              저장
            </Button>
          </Modal.Footer>
        </Modal>     
      {/* ========================== [[ 일정등록 Modal ]] ========================== */} 

    </>
  )
}

export default MemoDetail