import {addWeeks, addMonths, getUnixTime} from 'date-fns'
import { RECURRING_MONTHLY, RECURRING_WEEKLY } from './constants'

export const generateDates = (curTs, count, recurringMode) => {
  const tses = []
  for (let i=0; i<count; i++) {
    switch(recurringMode) {
      case RECURRING_WEEKLY: {
        tses.push(addWeeks(curTs, i))
        break
      }
      case RECURRING_MONTHLY: {
        tses.push(addMonths(curTs, i))
        break
      }
    }
  }
  return tses.map(x => getUnixTime(x))
}