import classes from './ActionButton.module.css'
import accountClasses from './Account.module.css'
import { useCallback } from 'react'
import Button from './Button'

export default ({shouldApprove, disabled, loading, handler,}) => {
  const callback = useCallback(() => {
    handler()
  }, [handler])
  return (<div className={classes.container}>
    {
    !loading && 
    <Button 
      disabled={disabled}
      handler={callback}
      label={shouldApprove ? 'Approve' : 'Send'}
    />
    }
    {
      loading && <div className={accountClasses['lds-dual-ring']}></div>
    }

  </div>)
}