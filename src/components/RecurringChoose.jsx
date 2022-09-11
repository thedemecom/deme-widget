import { useCallback } from 'react'
import classes from './RecurringChoose.module.css'
import {ONCE, RECURRING_MONTHLY} from '../constants'
import classNames from 'classnames'

const RECURRING_OPTIONS = [
  {mode: ONCE, name: 'once'}, 
  {mode: RECURRING_MONTHLY, name: 'montly'}
]

const RecurringOption = ({selected, mode, setter, label}) => {
  const callback = useCallback(_ => setter(mode))
  return <div className={classNames(classes.option, {[classes.selected]: selected})} onClick={callback}>{label}</div>
}

export default ({mode, setter}) => {
  return (<div className={classes.chooser}>
    {RECURRING_OPTIONS.map(option => <RecurringOption setter={setter} key={option.mode} selected={mode === option.mode} mode={option.mode} label={option.name} />)}
  </div>)
}