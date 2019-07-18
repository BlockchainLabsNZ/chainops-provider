import axios from 'axios'

interface IRequestOptions {
  headers: Object
  path: string
  data: string
  method: Method
}

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export async function request({
  method,
  headers,
  path,
  data
}: IRequestOptions) {
  const request = {
    method,
    headers,
    url: path,
    data
  }

  const response = await axios.request(request)
  return response
}
