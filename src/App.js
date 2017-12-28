import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      dayPerMonth: 20,
      hourPerDay: 8,
      now: null,
      numberOfPeople: 1,
      startTime: null,
      unitPrice: 10000000,
    }

    this.__counter = null

    this.__onClickStart = () => {
      this.setState({
        now: new Date(),
        startTime: new Date(),
      })

      this.startCounter()
    }

    this.__onClickStop = () => {
      this.stopCounter()
      this.forceUpdate()
    }

    this.__onClickResume = () => {
      this.setState({
        now: new Date(),
      })

      this.startCounter()
    }

    this.__onClickReset = () => {
      this.stopCounter()
      this.setState({
        now: null,
        startTime: null,
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.__counter)
  }

  startCounter() {
    const oneFps = 1000 / 60
    this.__counter = setInterval(() => this.setState({now: new Date()}), oneFps)
  }

  stopCounter() {
    clearInterval(this.__counter)
    this.__counter = null
  }

  render() {
    const {
      dayPerMonth,
      hourPerDay,
      now,
      numberOfPeople,
      startTime,
      unitPrice,
    } = this.state
    
    const elapsedTime = !!now && !!startTime ? (now - startTime) : 0
    const pricePerSecond = unitPrice / dayPerMonth / hourPerDay / 60 / 60
    const price = elapsedTime / 1000 * pricePerSecond * numberOfPeople

    return (
      <div>
        <h1>
          この会議の人件費は
          <strong>{Math.ceil(price).toLocaleString('ja-JP')}</strong>
          円です。
        </h1>
        <div>
          {!this.__counter && !now && <button onClick={this.__onClickStart}>開始</button>}
          {!!this.__counter && <button onClick={this.__onClickStop}>停止</button>}
          {!this.__counter && !!now && <button onClick={this.__onClickResume}>続行</button>}
          {!this.__counter && !!startTime && <button onClick={this.__onClickReset}>リセット</button>}
        </div>
      </div>
    )
  }
}

export default App
