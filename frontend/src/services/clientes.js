import api from './api'

export async function buscarClientePorTelefone(telefone) {
  const res = await api.get(`/clientes/telefone/${telefone}`)
  return res.data
}

export async function buscarClientePorCpf(cpf) {
  const res = await api.get(`/clientes/cpf/${cpf}`)
  return res.data
}

export async function criarCliente(data) {
  const res = await api.post('/clientes', data)
  return res.data
}

export async function listarClientes(params = {}) {
  const res = await api.get('/clientes', { params })
  return res.data
}

export async function buscarCliente(id) {
  const res = await api.get(`/clientes/${id}`)
  return res.data
}

export async function atualizarCliente(id, data) {
  const res = await api.put(`/clientes/${id}`, data)
  return res.data
}

export async function deletarCliente(id) {
  await api.delete(`/clientes/${id}`)
}
