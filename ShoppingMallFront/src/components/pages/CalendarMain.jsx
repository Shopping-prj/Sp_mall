import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, Modal } from 'react-bootstrap'
import Datetime from 'react-datetime'
import moment from 'moment'
import { ref, set } from 'firebase/database'
import { db } from '../../service/firebase'

// 선언부 - 선언(훅이랑 이벤트 핸들러)
// 화면부 - ()=> (return 생략 가능), ()=> {return 생략 불가}
const CalendarMain = () => {
  console.log('11');
  // 한개 레코드 
  const [memo, setMemo] = useState({
    id: 0,
    title: '',
    description: '',
    start: '',
    end: '',
    type: '',
    username: '',
    backgroundColor: '',
    textColor: '',
    allDay: false // radio, checkbox
  })
  // 하루종일 옵션 - 선택하기
  const [allDay, setAllDay] = useState(false)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  //오늘 이전 날짜 정보 비활성화기
  const yesterday = moment().subtract(1, 'day')
  const valid = (current) => {
    return current.isAfter(yesterday)
  }
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  //schedule.json 내용을 읽어와서 초기화 - 10건
  const [memoList, setMemoList] = useState([])
  useEffect(() => {//비동기 처리, useState훅 초기화
    console.log('effect');
    //fetch(): JSON.stringify, JSON.parse-> axios
    //클라우드서비스 활용
    //then역할 : 앞에 URL요청에 대해 결과가 나올때 기다렸다가
    //결과가 다 나오면(결정되면) 그러면 처리해줘
    axios.get('/schedule.json').then(res => {
      console.log(res.data);
      //insert here - state훅에 담아보기
      setMemoList(res.data)
    })
  },[])
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )    
  }
  const handleStart = (date) => {
    console.log(date._d);
    const start = moment(date._d).format('YYYY-MM-DD, a h:mm')
    console.log(start);
    setStart(start)
  }
  const handleEnd = (date) => {
    const end = moment(date._d).format('YYYY-MM-DD, a h:mm')
    console.log(end);
    setEnd(end)
  }
  //npm i @fullcalendar/interaction 설치
  // plugins={[XXXXX, interactionPlugin-추가]}
  const handleDateClick = (arg) => {
    console.log('handleDateClick');
    console.log(arg);
    //TODO - 모달을 띄운다
    handleShow()
  }
  //폼으로 묶음 -> 서버측에 값을 넘기는 건 onChange 초기화
  //input이 만들어 질 때마다 생성 해야하는 단점이 있어서 이것을 하나로
  // 해결 해 본다
  const handleChangeForm = (event) => {
    // 폼 내용 변경 발생 name, value
    // event.target.name자리에 m_
    console.log(event.target.name+", "+event.target.value);
    // 대괄호로 감싸면 키값이 된다. 변수를 동적으로 만들어줌
    setMemo({
      ...memo, id: Date.now(),
      [event.target.name]: event.target.value
    })
    // 만일 화면에서 체크박스 옵션 추가하면
    if(event.target.name === 'allDay'){
      setAllDay(true) // 디폴트는 false다
      // 여기서 선택된 옵션값을 memo훅에도 추가를 해야한다
      setMemo({
        ...memo, allDay: true
      })
    }
  }// end of handleChangeForm
  // 일정을 저장하기 누르면 호출되는 함수이다
  // 사용자가 입력한 값을 파라미터로 전달해야한다
  const memoAdd = () => {
    const pmemo = {
      id: memo.id, // input컴포넌트 상태가 변하면 그 때 담기
      title: memo.title,
      username: memo.username,
      description: memo.description,
      start: start,
      end: end,
      backgroundColor: memo.backgroundColor,
      allDay: memo.allDay
    }
    console.log(pmemo);
    // 저장하기 구현
    set(ref(db, 'schedule/' + memo.id), pmemo);
    // 모달창을 닫기
    handleClose()// 모달 닫힘
  }// end of memoAdd
  // NoSQL경우 특이사항 - 입력과 수정이 같은 방식으로 적용일어난다
  // 입력, 수정 같다, 삭제, 조회
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={memoList}
        eventContent={renderEventContent}
        selectable="true"
        editable="true"
        dateClick={handleDateClick}
        height={"100vh"}
      />
      {/* 일정 등록 모달 */}
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
              <Form.Control className='form-control form-control-sm' type="text" name="title" onChange={handleChangeForm} placeholder="Enter 일정명" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="boardWriter">
              <Form.Label className="col-sm-2 col-form-label">등록자</Form.Label>
              <div className='col-sm-10'>
              <Form.Control type="text" name="username" onChange={handleChangeForm} className='form-control form-control-sm' placeholder="Enter 작성자" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="edit-start">
              <Form.Label className="col-sm-2 col-form-label">시작</Form.Label>
              <div className='col-sm-10'>
              <Datetime dateFormat='YYYY-MM-DD' isValidDate={valid} name="start" onChange={handleStart}/>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="edit-end">
              <Form.Label className="col-sm-2 col-form-label">끝</Form.Label>
              <div className='col-sm-10'>
              <Datetime dateFormat='YYYY-MM-DD' isValidDate={valid} name="end" onChange={handleEnd}/>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 row" controlId="edit-color">
              <Form.Label className="col-sm-2 col-form-label">색상</Form.Label>
              <div className="col-sm-10">
              <Form.Select onChange={handleChangeForm} className="form-control form-control-sm" name="backgroundColor" id="backgroundColor">
                <option value="#D25565" style={{color:"#D25565"}}>빨간색</option>
                <option value="#9775fa" style={{color:"#9775fa"}}>보라색</option>
                <option value="#ffa94d" style={{color:"#ffa94d"}}>주황색</option>
                <option value="#74c0fc" style={{color:"#74c0fc"}}>파란색</option>
                <option value="#f06595" style={{color:"#f06595"}}>핑크색</option>
                <option value="#63e6be" style={{color:"#63e6be"}}>연두색</option>
                <option value="#a9e34b" style={{color:"#a9e34b"}}>초록색</option>
                <option value="#4d638c" style={{color:"#4d638c"}}>남색</option>
                <option value="#495057" style={{color:"#495057"}}>검정색</option>
              </Form.Select>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 row" controlId="boardContent">
              <Form.Label className="col-sm-2 col-form-label">내용</Form.Label>
              <div className='col-sm-10'>
              <textarea className="form-control" name='description' onChange={handleChangeForm} rows="3"></textarea>
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
      {/* 일정 등록 모달 */}
    </>
  )
}

export default CalendarMain