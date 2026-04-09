const AppError = require('../utils/AppError');
const clientesRepository = require('../repositories/clientesRepository');

async function listar({ q, page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const { rows, total } = await clientesRepository.listar({ q, limit, offset });
  return { data: rows, total, page: Number(page), limit: Number(limit) };
}

async function buscarPorCpf(cpf) {
  const digits = cpf.replace(/\D/g, '');
  return clientesRepository.buscarPorCpf(digits);
}

async function buscarPorTelefone(telefone) {
  const digits = telefone.replace(/\D/g, '');
  return clientesRepository.buscarPorTelefone(digits);
}

async function buscarPorId(id) {
  const cliente = await clientesRepository.buscarPorId(id);
  if (!cliente) throw AppError.notFound('Cliente não encontrado');
  return cliente;
}

async function criar({ nome, telefone, cpf, email, informacao_adicional }) {
  return clientesRepository.criar({ nome, telefone, cpf, email, informacao_adicional });
}

async function atualizar(id, { nome, telefone, cpf, email, informacao_adicional }) {
  await buscarPorId(id);
  return clientesRepository.atualizar(id, { nome, telefone, cpf, email, informacao_adicional });
}

async function deletar(id) {
  await buscarPorId(id);

  const temOrdens = await clientesRepository.possuiOrdens(id);
  if (temOrdens) {
    throw AppError.conflict('Não é possível excluir cliente com ordens de serviço cadastradas');
  }

  await clientesRepository.deletar(id);
}

module.exports = { listar, buscarPorTelefone, buscarPorCpf, buscarPorId, criar, atualizar, deletar };
