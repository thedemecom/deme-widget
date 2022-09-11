import demeAbi from './abis/Deme.json'
import { ethers } from 'ethers'

export const getTokenContract = (tokenAddress, signer) => {
  return new ethers.Contract(
    tokenAddress, 
    [
      'function balanceOf(address account) view returns (uint256)',
      'function approve(address spender, uint256 amount) external returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function transfer(address to, uint256 amount) external returns (bool)',
    ], 
    signer,
  )
}


const demeContractsMap = {
  56: '0x7b1C4e1a397fbfFf2736F172ef04D9Feb321C4fA'
}

export const getDemeContract = (chainId, signer) => {
  if (!demeContractsMap[chainId]) {
    return null
  }
  return new ethers.Contract(
    demeContractsMap[chainId], 
    demeAbi,
    signer,
  )
}