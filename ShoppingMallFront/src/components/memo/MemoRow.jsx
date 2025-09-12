import React from 'react'
import { Link } from 'react-router-dom';
// MemoList > MemoRow(<tr></tr>)
const MemoRow = ({memo}) => {
  console.log(memo);
  return (
    <>
      <tr>
        <td>{memo.m_no}</td>
        <td>
          <Link to={`/memo/detail/${memo.m_no}`} className='btn btn-primary'>{memo.m_title}</Link>
        </td>
        <td>{memo.m_writer}</td>
        <td>{`${memo.m_start} ~ ${memo.m_end}`}</td>
      </tr>    
    </>
  )
}

export default MemoRow