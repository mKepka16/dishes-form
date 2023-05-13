import axios from 'axios'
import { ApiDish } from '../types/dish'

export function addNewDishApi(apiDish: ApiDish) {
  const API_URL =
    'https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/'
  return axios.post(API_URL, apiDish)
}
