import { useCallback, useEffect, useState } from 'react';
import classes from './app.module.css';
import {injected} from './connectors'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { ethers, providers } from 'ethers'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import Account from './components/Account';
import TokenSelector from './components/TokenSelector';
import InputAmount from './components/InputAmount';
import RecurringChoose from './components/RecurringChoose';
import { ONCE } from './constants';
import ActionButton from './components/ActionButton';
import { generateDates } from './utils';
import { getDemeContract, getTokenContract } from './contracts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const {Web3Provider} = providers


function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App({
  receiverAddress,
  tokenList
}) {
  const { active, account, connector } = useWeb3React()

  const [token, setToken] = useState(tokenList[0].address)

  const [amount, setAmount] = useState('')
  const [recurringMode, setRecurring] = useState(ONCE)

  const [isLoading, setIsLoading] = useState(false)

  const [shouldApprove, setShouldApprove] = useState(false)

  const [activeHash, setHash] = useState(null)

  const [chainId, setChainId] = useState(null)

  useEffect(() => {
    if (active) {
      connector.getProvider().then(async provider => {
        const web3Provider = new ethers.providers.Web3Provider(provider)
        const { chainId } = await web3Provider.getNetwork()
        setChainId(chainId)
      })
    } else {
      setChainId(null)
    }
  }, [active, connector])


  const disabled = !active || !amount || !token || isLoading || activeHash

  useEffect(() => {
    if (connector && activeHash) {
      let interval = setInterval(() => {
        connector.getProvider().then(async provider => {
          const web3Provider = new ethers.providers.Web3Provider(provider)
          const receipt = await web3Provider.getTransactionReceipt(activeHash)
          if (receipt && receipt.blockNumber) {
            toast(
              receipt.status == 1 ? 'Success' : 'Failed', 
              {
                type: receipt.status == 1 ? 'success' : 'error',
                toastId: 1
              }
            )
            setHash(null)
          }
        })
      }, 1000)
      return () => {
        clearInterval(interval)
      }
    } else {
      if (activeHash) {
        setHash(null)
      }
    }
  }, [activeHash, connector])

  const handler = useCallback(() => {
    if (active && amount) {
      connector.getProvider().then(async provider => {
        setIsLoading(true)
        try {
          const web3Provider = new ethers.providers.Web3Provider(provider)
          const signer = web3Provider.getSigner()
          const tokenContract = getTokenContract(token, signer)
          const bigAmount = ethers.utils.parseEther(amount)
          const needAmount = ethers.utils.parseEther(amount).mul(recurringMode == ONCE ? 1 : 12 )
          const deme = getDemeContract(chainId, signer)
          if (shouldApprove) {
            const res = await tokenContract.approve(deme.address, needAmount)
            setHash(res.hash)
            setIsLoading(false)
          } else {
            if (recurringMode == ONCE) {
              const res = await tokenContract.transfer(receiverAddress, bigAmount)
              setHash(res.hash)
              setIsLoading(false)
            } else {
              const params = {
                token: token,
                to: receiverAddress,
                amount: bigAmount,
                dates: generateDates(Date.now(), 12, recurringMode)
              }
              const res = await deme.setupCheque(params)
              setHash(res.hash)
              setIsLoading(false)
            }
          }
        } catch (e) {
          setIsLoading(false)
        }
      })
    }
  }, [amount, recurringMode, active, account, shouldApprove, chainId])

  useEffect(() => {
    if (active ) {
      const needAmount = ethers.BigNumber.from(amount || '0')
      .mul(ethers.BigNumber.from(10).pow(18))
      .mul(recurringMode == ONCE ? 0 : 12)
      connector.getProvider().then(async provider => {
        setIsLoading(true)
        try {
          const signer = new ethers.providers.Web3Provider(provider).getSigner()
          const deme = getDemeContract(chainId, signer)
          if (!deme) {
            setIsLoading(false)
            return
          }
          const contract = getTokenContract(token, signer)
          const allowed = await contract.allowance(account, deme.address)
          setShouldApprove(allowed.lt(needAmount))
          setIsLoading(false)
        } catch(e) {
          setIsLoading(false)
        }
      })
    }
  }, [amount, token, account, active, recurringMode, chainId])

  return (
    <div className={classes.app}>
      <ToastContainer/>
      <Account />
      <div className={classes.row}>
        <div className={classes.token}>
          <TokenSelector
          tokenList={tokenList}
          token={token}
          setToken={setToken}
          />
        </div>
        <div className={classes.recurring}>
          <RecurringChoose
          mode={recurringMode}
          setter={setRecurring}
          />
        </div>
      </div>
      <InputAmount amount={amount} setAmount={setAmount} />
      
      <ActionButton
        handler={handler}
        disabled={disabled}
        loading={activeHash}
        shouldApprove={shouldApprove}
      />
    </div>
  );
}

export default function({
  receiverAddress,
  tokenList,
}) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App receiverAddress={receiverAddress} tokenList={tokenList}/>
    </Web3ReactProvider>
  )
}

