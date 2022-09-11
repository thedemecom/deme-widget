import classes from './TokenSelector.module.css'
import classNames from 'classnames'
import { memo, useCallback } from 'react'

const Token = ({name, selected, address}) => {
  return (
    <option value={address} selected={selected}>{name}</option>
  )
}

export default memo(({
  tokenList,
  token,
  setToken
}) => {
  return <div className={classes.selector}>
    <select 
    className={classes.select} 
    placeholder={'select token'} 
    value={token} 
    onChange={e => setToken(e.target.value)}>
    {tokenList.map(t => <Token 
      name={t.name} 
      icon={t.icon} 
      key={t.name} 
      address={t.address}
    />)}
    </select>
  </div> 
})