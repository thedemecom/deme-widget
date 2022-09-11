import classes from './Account.module.css'
import {useWeb3React} from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../hooks'
import { useCallback, useState } from 'react'
import { injected } from '../connectors'
import Button from './Button'

export default () => {
  const { active, error, account, activate } = useWeb3React()

  const [isActivating, setIsActivating] = useState(false)

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  const activateHandler = useCallback(() => {
    setIsActivating(true)
    activate(injected).then(() =>{
      setIsActivating(false)
    }).catch(() => {
      setIsActivating(false)
    })
  }, [activate])

  return (
    <div className={classes.account}>
      {isActivating && <div className={classes['lds-dual-ring']}></div>}
      {!isActivating && !active && <Button label={'Connect wallet'} handler={activateHandler} />}
      {!isActivating && active && 
      <>
        <div className={classes.address}>{account}</div>
        <div className={classes.tooltip}>{account}</div>
      </>}
    </div>
  )

}