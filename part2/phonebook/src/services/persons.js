import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newOject) => { 
    const request = axios.put(`${baseUrl}/${id}`, newOject)
    return request.then(response => response.data)
}

// can't make delete a variable name! it's reserved
const remove = id => {
    const request = axios.delete(`${baseUrl}/${id}`) 
    return request
}

export default { getAll, create, update, remove }