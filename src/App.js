import React from 'react';
import './App.css';
import CustomCalendar from '@/components/CustomCalendar/Calendar.jsx'
class App extends React.Component{

  onChangeMonth = (year, month, day) => {
    console.log(year, month, day)
  }

  render(){
    return(
      <div className="App">
      <CustomCalendar
       onChangeMonth={(year, month, day) => this.onChangeMonth(year, month, day)}
       />
    </div>
    )
  }
}

export default App;
