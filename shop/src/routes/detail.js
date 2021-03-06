import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { Nav, Tab } from 'react-bootstrap';
import Context1 from '../App.js';
import { addList } from '../store.js';
import { useDispatch } from "react-redux";

// 예전 문법 기준
// class Detail2 extends React.Component {
//   componentDidMount(){
//     //Detail2 컴포넌트가 로드되고나서 실행할 코드
//   }
//   componentDidUpdate(){
//     //Detail2 컴포넌트가 업데이트 되고나서 실행할 코드
//   }
//   componentWillUnmount(){
//     //Detail2 컴포넌트가 삭제되기전에 실행할 코드
//   }
// }

let PinkBtn = styled.button`
  background: ${ props => props.bg };
  color: ${ props => props.bg == 'blue' ? 'white' : 'black' };
  padding: 10px;
`
// 복사
let newBtn = styled.button(PinkBtn);

let BlackBox = styled.div`
  background-color: #000;
  color: #fff;
`

function Detail(props) {
    let [count, setCount] = useState(0);
    let [alert, setAlert] = useState(true);
    let {id} = useParams();
    let reArr = props.shoes.filter((i) => i.id == id)[0];
    let [tab, setTab] = useState(0);
    let [fade, setFade] = useState('');
    let dispatch = useDispatch();
    
    // 현재 문법 기준 (function 외부에서도 가능)
    /*
    useEffect 사용 이유 : html 렌더링 후 동작하기 때문에 
    ex. 연산, 서버에서 데이터 가져올때, 타이머 등
    */
    useEffect(() => {
      // mount, update 실행 시 여기 코드 실행 (디버깅 시 두번 동작 싫으면 index.js -> React.strictMode 제거)
      // 페이지 방문 2초 후 박스 미노출
      let a = setTimeout(() => { setAlert(false); }, 2000);
      let b = setTimeout(() => { setFade('end'); }, 100);

      let arr = JSON.parse(localStorage.getItem('watched'));
      arr.push(reArr.id);
      arr = new Set(arr);
      arr = Array.from(arr);
      localStorage.setItem('watched', JSON.stringify(arr));

      // clean up function : useEffect 내부 코드 중 가장 먼저 실행
      return () => {
        setFade('');
        clearTimeout(a);
        clearTimeout(b);
      }
    }, []) // [] 실행조건 넣을 수 있는 곳 (아무것도 안넣으면 1회만 실행하고 그 후는 실행 X)

    return (
      <div className={`container start ${fade}`}>
        {alert == true ? <div className="show-box">2초 이내 구매시 할인</div> : null}
        <button onClick={() => {setCount(count+1)}}>버튼{count}</button>
        <div className="row">
          <div className="col-md-6">
            <img src={"https://codingapple1.github.io/shop/shoes" + (reArr.id + 1) + ".jpg"} width="100%" />
          </div>
          <div className="col-md-6">
            <h4 className="pt-5">{reArr.title}</h4>
            <p>{reArr.content}</p>
            <p>{reArr.price}원</p>
            <button className="btn btn-danger" onClick={() => {dispatch(addList({id: reArr.id + 3, name: reArr.title, count: 1}))}}>주문하기</button> 
          </div>
        </div>

        <Nav variant="tabs"  defaultActiveKey="link0">
            <Nav.Item>
              <Nav.Link eventKey="link0" onClick={() => {setTab(0)}}>버튼0</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link1" onClick={() => {setTab(1)}}>버튼1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link2" onClick={() => {setTab(2)}}>버튼2</Nav.Link>
            </Nav.Item>
        </Nav>
        <TabContent tab={tab} />
      </div> 
    )
  }

  function TabContent({tab}) {
    let [fade, setFade] = useState('');
    let arr = [];

    useEffect(() => {
      /*
      clean up function 이 동작하는데 왜 이렇게 시간을 줘야 하는지?
      => 리액트의 automatic batching (18버전 이상) 기능 때문이다.
      state 변경함수가 근처에 있다 -> 최종적으로 합쳐서 마지막에 딱 한번만 실행시켜준다. 
      결론은 하나로 합쳐서 'end'가 붙게 되는 것
      */
      let a = setTimeout(() => { setFade('end') }, 100)

      return () => {
        clearTimeout(a);
        setFade('');
      }
    }, [tab])  

    return (
    <div className={`start ${fade}`}>
      {arr[tab]}
    </div>
    )
  }

  export default Detail;