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


    let date = moment(new Date).toDate();
    console.log(date)
    if (date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      this.initState({ y, m, d });
    } else {
      this.initState({});
    }
  }

  componentDidUpdate(prevProps,prevState){
    if(prevProps.defaultDate !== this.props.defaultDate){  //翻到以前的月份 显示最后一天，这里是显示哪个月份的判断在  onChangeMonth() 中定义state的值
      
      let date = this.props.defaultDate;
      if (date) {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        this.initState({ y, m, d });
      } else {
        this.initState({});
      }
    }
  }

  initState = ({ y, m, d }, handleFun) => {  // 数据初始化
    let date = new Date();
    let today = d;
    let year = y || date.getFullYear(); // 本年
    let month = m || date.getMonth() + 1; //本月
 
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

    let hlist = _.chunk(list, 7); //转化为二位数组
    let len = hlist.length;
    let to = 7 - hlist[len - 1].length;


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

  backMonth = () => {  //上月
    let prevMonth = this.state.month + -1;
    let prevYear = this.state.year;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    this.initState({
      y: prevYear,
      m: prevMonth
    }, this.handleChangeMonth)

  }
  nextMonth = () => { // 下月
    let prevMonth = this.state.month + 1;
    let prevYear = this.state.year;
    if (prevMonth > 12) {
      prevMonth = 1;
      prevYear += 1;
    }
    this.initState({
      y: prevYear,
      m: prevMonth
    }, this.handleChangeMonth);
  }

  /**
   * @param year 当前年份
   * @param month 当前月份
   * @param day 当前日是星期几
   * 
   */
  handleChangeMonth = (year, month, day) => {
    if (this.props.onChangeMonth) {
      this.props.onChangeMonth(year, month, day);
    }
  }

  handleChangeDate = (date,item,ii,current) => {  //点击日期

    if(current === 0){  // 点击非当月日期
      return 
    }
    let hlist = this.state.hlist;
    // 全部重置为false
    for(let items of hlist){
      for(let item of items){
        item.isSelected = false
      }
    }
    hlist[item][ii].date = current;
    hlist[item][ii].isSelected = true;

    this.setState({
      hlist:[...hlist]
    });

    this.props.onChangeDate(date)


  }

  render() {
    const { year, month } = this.state;
    let date2 = new Date(year, month - 1, 0);
    let beforeMonthDays = date2.getDate();//上个月共有多少天

    return (
      <>
        <div className={styles.calendarBox}>
          <div className={styles.titleName}>
            <div className={styles.iconBtn} onClick={() => this.backMonth()}>
              <img src={require('../../assets/icon_back.png')} alt="上一月" />
            </div>
            <span>{year}年{month}月</span>
            <div className={styles.iconBtn} onClick={() => this.nextMonth()}>
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
                          <li onClick={this.handleChangeDate.bind(this,moment(`${year}-${month}-${item.date}`,'YYYY-MM-DD').toDate(), index, ii, item.date)} className={item.date === 0 ? styles.otherdaysText : styles.daysText} key={ii}>

                           <div className={item.isSelected && new Date() >= moment(`${year}-${month}-${item.date}`,'YYYY-MM-DD').toDate() ? styles.itemSelected : styles.itemNoSelected}>
                            {item.date > 0 ? item.date : (index === 0 ? firstRowForZero[ii] : lastRowForZero[ii])}
                            
                            </div>
                            {
                              new Date() >= moment(`${year}-${month}-${item.date}`, 'YYYY-MM-DD').toDate() && (item.isHave ?
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
          <div className={styles.bottomBox}>
            <div></div>
          </div>
        </div>
      </>
    )
  }
}

export default CustomCalendar;