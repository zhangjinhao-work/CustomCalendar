import React from 'react';
import './App.css';
import CustomCalendar from '@/components/CustomCalendar/Calendar.jsx'
import moment from 'moment'
class App extends React.Component{

  state = {
    clickDateTime: ""   // 控制日历显示变量
  }
  componentDidMount(){
    
  }

  onChangeDate = (date) => {  // 点击日期
    this.setState({
      clickDateTime: moment(date).format('YYYY-MM-DD')
    },() => {
      console.log(this.state.clickDateTime)
    })
  }

  onChangeMonth = (year, month, day) => {
    if(year == moment().format("YYYY") && month == moment().format("MM")){
      this.setState({
        clickDateTime:moment(new Date()).format('YYYY-MM-DD')  // 当月的最后一天
      })
    }else{
      this.setState({
        clickDateTime:moment(new Date(year, month, 0)).format('YYYY-MM-DD')  // 当月的最后一天
      })
    }
    
  }

  render(){
    return(
      <div className="App">
      <CustomCalendar
        defaultDate={moment(this.state.clickDateTime).toDate()}
        // haveDays=()
        onChangeDate={(date) => this.onChangeDate(date)}
        onChangeMonth={(year, month, day) => this.onChangeMonth(year, month, day)}
       />
    </div>
    )
  }
}

export default App;
