import { useCallback } from 'react';
import classes from './InputAmount.module.css';

export default ({
  amount,
  setAmount,
}) => {
  const handler = useCallback((e) => {
    setAmount(e.target.value)
  })
  return (<div className={classes.inputAmount}>
    <input 
    placeholder='amount of payment'
    type="number" 
    min={0} 
    value={amount} 
    className={classes.input}
    onChange={handler}
    />
  </div>)
}