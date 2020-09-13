import React from 'react'
import * as _ from 'lodash'
import styles from './Calendar.less'
import moment from 'moment'

const weeks = ["一", "二", "三", "四", "五", "六", "日"];



class CustomCalendar extends React.Component {

  state = {
    date: new Date(),
    year: 2020,
    month: 2,
    days: 5,
    day: 1,
    hlist: [],
    height: '80vh',
    isClose: false,
  };

  haveDays = ["2020-9-7", "2020-9-9", "2020-9-4", "2020-9-5", "2020-9-8", "2020-9-6", "2020-9-2", "2020-9-3"]  // 已签到的日期

  componentDidMount() {


    let date = moment('2020-09-12').toDate();
    console.log(date.getFullYear())
    if (date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      this.initState({ y, m, d });
    } else {
      this.initState({});
    }
  }

  initState = ({ y, m, d }, handleFun) => {  // 数据初始化
    let date = new Date();
    let today = d;
    let year = y || date.getFullYear(); // 本年
    let month = m || date.getMonth() + 1; //本月
    console.log(year)
    let date2 = new Date(year, month, 0);
    let days = date2.getDate();  // 本月共有多少天


    date2.setDate(1);
    let day = date2.getDay();  // 获取到本月第一天是星期几

    if (day == 0) {  // 为0 的时候是星期日
      day = 7
    }

    let list = [];
    for (let i = 1; i < days + day; i++) {  // i 控制 每月一号出现的位置
      let obj = {
        date: 0,
        isSelected: false,
        isHave: false
      }

      if (i < day) {
        obj.date = 0
      } else {
        obj.date = i - day + 1
        if (obj.date === today) {
          obj.isSelected = true; // 被选中
        }


        if (this.haveDays.includes(`${year}-${month}-${obj.date}`)) {
          obj.isHave = true;  //日历中的对应的下标
        }
      }

      list.push(obj)

    }
    console.log(list)
    let hlist = _.chunk(list, 7); //转化为二位数组
    let len = hlist.length;
    let to = 7 - hlist[len - 1].length;
    console.log(hlist)

    //循环尾部补空格
    for (let i = 0; i < to; i++) {
      hlist[len - 1].push({
        date: 0,
        isSelected: false,
        isHave: false
      });
    }

    this.setState({
      date,
      year,
      month,
      days,
      day,
      hlist,
    }, () => {
      if (handleFun) {
        handleFun(year, month, day)
      }
     
    })





  }


  render() {
    const { year, month } = this.state;
    let date2 = new Date(year, month - 1, 0);
    let beforeMonthDays = date2.getDate();//上个月共有多少天

    return (
      <>
        <div className={styles.calendarBox}>
          <div className={styles.titleName}>
            <div className={styles.iconBtn}>
              <img src={require('../../assets/icon_back.png')} alt="上一月" />
            </div>
            <span>2020年9月20日</span>
            <div className={styles.iconBtn}>
              <img src={require('../../assets/icon_next.png')} alt="下一月" />
            </div>
          </div>
          <div>
            <ul className={styles.weekText}>
              {
                weeks.map(item => (
                  <li key={item}>
                    {item}
                  </li>
                ))
              }
            </ul>
          
              {
                this.state.hlist.map((el, index) => {
                  let firstRowForZero = [];
                  let lastRowForZero = [];
                  if (index === 0 || index === this.state.hlist.length - 1) {
                    let zeroCount = 0;
                    for (let i = 0; i < el.length; i++) {
                      if (el[i].date === 0) {  // 0说明还不是一号开头 
                        zeroCount++;
                        if (i > 0 && el[6].date === 0) {
                          lastRowForZero[i] = zeroCount
                        }
                      }
                    }
                    for (let i = 0; i < zeroCount; i++) {
                      firstRowForZero.push(beforeMonthDays - zeroCount + 1 + i)
                    }
                    if (lastRowForZero.length === 0) {
                      lastRowForZero = firstRowForZero
                    }

                  }

                  return (
                    <ul className={styles.daysText} key={index}>
                      {
                        el.map((item, ii) => {
                          return (
                            <li className={item.date === 0?styles.otherdaysText : styles.daysText} key={ii}>
                              {item.date > 0 ? item.date : (index === 0 ? firstRowForZero[ii] : lastRowForZero[ii])}
                             {
                              new Date() >= moment(`${year}-${month}-${item.date}`,'YYYY-MM-DD').toDate() && (item.isHave?
                               <i className={styles.havei}></i>
                               :
                               <i className={styles.nothavei}></i>)
                             }
                            </li>
                          )
                        })
                      }
                  </ul>
                  )

                })

              }

           
          </div>
        </div>
      </>
    )
  }
}

export default CustomCalendar;