import React, { Component, Fragment } from 'react'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      dayPerMonth: 20,
      hourPerDay: 8,
      now: null,
      numberOfPeople: 1,
      showSetting: false,
      startTime: null,
      unitPricePerDay: 1000,
      unitPricePerMonth: 1000000,
      unitPriceType: 'perMonth',
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
      showSetting,
      startTime,
      unitPricePerDay,
      unitPricePerMonth,
      unitPriceType,
    } = this.state
    
    const elapsedTime = !!now && !!startTime ? (now - startTime) : 0
    let pricePerSecond
    if (unitPriceType === 'perDay') {
      pricePerSecond = unitPricePerDay / 60 / 60
    } else {
      pricePerSecond = unitPricePerMonth / dayPerMonth / hourPerDay / 60 / 60
    }
    const price = elapsedTime / 1000 * pricePerSecond * numberOfPeople

    let setting
    if (showSetting) {
      setting = (
        <div>
          <UnitPriceType {...{
            onChange: (s) => this.setState(s),
            unitPriceType,
          }} />
          {unitPriceType === 'perMonth' && <UnitPricePerMonth {...{
            dayPerMonth,
            hourPerDay,
            numberOfPeople,
            onChange: (s) => this.setState(s),
            unitPricePerMonth,
          }}/>}
          {unitPriceType === 'perDay' && <UnitPricePerDay {...{
            onChange: (s) => this.setState(s),
            numberOfPeople,
            unitPricePerDay
          }}/>}
        </div>
      )
    }

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
        <ToggleSetting {...{
          onChange: (s) => this.setState(s),
          showSetting,
        }}/>
        {setting}
      </div>
    )
  }
}

const ToggleSetting = (props) => {
  let text = '設定を表示する'
  if (props.showSetting) {
    text = '設定を隠す'
  }
  return (
    <a {...{
      href: '#',
      onClick: (e) => {
        e.preventDefault()
        props.onChange({showSetting: !props.showSetting})
      },
    }}>
      {text}
    </a>
  )
}

const UnitPriceType = (props) => {
  return (
    <Fragment>
      <div>
        <label htmlFor={'perMonth'}>
          <input {...{
            checked: props.unitPriceType === 'perMonth' ? 'checked' : '',
            id: 'perMonth',
            onChange: () => props.onChange({unitPriceType: 'perMonth'}),
            type: 'radio',
            value: 'perMonth',
          }} />
          月単価
        </label>
        <label htmlFor={'perDay'}>
          <input {...{
            checked: props.unitPriceType === 'perDay' ? 'checked' : '',
            id: 'perDay',
            onChange: () => props.onChange({unitPriceType: 'perDay'}),
            type: 'radio',
            value: 'perDay',
          }} />
          時給
        </label>
      </div>
    </Fragment>
  )
}

const UnitPricePerMonth = (props) => {
  return (
    <Fragment>
      <div>
        <label htmlFor={'hourPerDay'}>
          人数
        </label>
        <input {...{
          id: 'numberOfPeople',
          onChange: (e) => props.onChange({numberOfPeople: e.target.value}),
          type: 'input',
          value: props.numberOfPeople,
        }}/>
      </div>
      <div>
        <label htmlFor={'hourPerDay'}>
          日/月
        </label>
        <input {...{
          id: 'dayPerMonth',
          onChange: (e) => props.onChange({dayPerMonth: e.target.value}),
          type: 'input',
          value: props.dayPerMonth,
        }}/>
      </div>
      <div>
        <label htmlFor={'hourPerDay'}>
          時間/日
        </label>
        <input {...{
          id: 'hourPerDay',
          onChange: (e) => props.onChange({hourPerDay: e.target.value}),
          type: 'input',
          value: props.hourPerDay,
        }}/>
      </div>
      <div>
        <label htmlFor={'hourPerDay'}>
          月単価
        </label>
        <input {...{
          id: 'unitPricePerMonth',
          onChange: (e) => props.onChange({unitPricePerMonth: e.target.value}),
          type: 'input',
          value: props.unitPricePerMonth,
        }}/>
      </div>
    </Fragment>
  )
}

const UnitPricePerDay = (props) => {
  return (
    <div>
      <div>
        <label htmlFor={'hourPerDay'}>
          人数
        </label>
        <input {...{
          id: 'numberOfPeople',
          onChange: (e) => props.onChange({numberOfPeople: e.target.value}),
          type: 'input',
          value: props.numberOfPeople,
        }}/>
      </div>
      <div>
        <label htmlFor={'hourPerDay'}>
          時給
        </label>
        <input {...{
          id: 'unitPricePerDay',
          onChange: (e) => props.onChange({unitPricePerDay: e.target.value}),
          type: 'input',
          value: props.unitPricePerDay,
        }}/>
      </div>
    </div>
  )
}

export default App
