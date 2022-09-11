import classNames from 'classnames'
import classes from './Button.module.css'
const noOp = () => {}

export default ({label, disabled, handler}) => {
  return (<div>
    <div 
    tabIndex={0}
    className={classNames(classes.button, {[classes.disabled]: disabled})}
    onClick={disabled ? noOp : handler}
    >{label}</div>
  </div>)
}