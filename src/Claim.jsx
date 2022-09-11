import { useCallback, useEffect, useState } from 'react';
import classes from './app.module.css';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { ethers, providers } from 'ethers'
import Account from './components/Account';
import { ONCE } from './constants';
import { generateDates } from './utils';
import { getDemeContract, getTokenContract } from './contracts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import Button from './components/Button';
import { de } from 'date-fns/locale';

const {Web3Provider} = providers


function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function Claim() {
  const { active, account, connector } = useWeb3React()

  const [amount, setAmount] = useState(0)

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

  useEffect(() => {
    if (account && connector) {
      connector.getProvider().then(async provider => {
        try {
          const web3Provider = new ethers.providers.Web3Provider(provider)
          const signer = web3Provider.getSigner()
          const deme = getDemeContract(chainId, signer)
          if (deme) {
          const ids = await deme.claimableCheques(account)
          console.log('ids', ids)
          const cheques = await Promise.all(ids.map(id => deme.cheques(id)))
          const sum = cheques.reduce((acc, cheque) => acc.add(cheque.amount), ethers.BigNumber.from(0))
          setAmount(ethers.utils.formatEther(sum))
          }
        } catch(e) {
          console.error(e)
        }
      })
    }
  }, [account, connector, chainId, activeHash])

  const handler = useCallback(() => {
    if (active && amount) {
      connector.getProvider().then(async provider => {
        try {
          const web3Provider = new ethers.providers.Web3Provider(provider)
          const signer = web3Provider.getSigner()
          const deme = getDemeContract(chainId, signer)
          const ids = await deme.claimableCheques(account)
          const res = await deme.claimCheques(ids)
          setHash(res.hash)
        } catch (e) {
        }
      })
    }
  }, [amount, active, account, chainId])

  return (
    <div className={classes.app}>
      <ToastContainer/>
      <Account />
      <div style={{marginBottom: '8px'}}>
        Total: {amount} $
      </div>
      <Button
        label={'Claim'}
        disabled={amount ? false : true}
        handler={handler}
      />
    </div>
  );
}

export default function() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Claim />
    </Web3ReactProvider>
  )
}

