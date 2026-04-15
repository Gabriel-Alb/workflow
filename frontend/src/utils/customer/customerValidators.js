export function isValidEmail(value = "") {
  const email = String(value).trim();

  if (!email) return true;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateCustomerName(value = "") {
  const name = String(value).trim();

  if (!name) {
    return "Informe o nome do cliente.";
  }

  return "";
}

export function validateCustomerPhone(value = "") {
  const digits = String(value).replace(/\D/g, "");

  if (!value) return "";

  if (digits.length < 10) {
    return "Telefone incompleto.";
  }

  return "";
}

export function validateCustomerCpf(value = "") {
  const digits = String(value).replace(/\D/g, "");

  if (!value) return "";

  if (digits.length !== 11) {
    return "CPF deve ter 11 dígitos.";
  }

  return "";
}

export function validateCustomerEmail(value = "") {
  if (!value) return "";

  if (!isValidEmail(value)) {
    return "E-mail inválido.";
  }

  return "";
}

export function validateCustomerField(field, form = {}) {
  switch (field) {
    case "nome":
      return validateCustomerName(form.nome);

    case "telefone":
      return validateCustomerPhone(form.telefone);

    case "cpf":
      return validateCustomerCpf(form.cpf);

    case "email":
      return validateCustomerEmail(form.email);

    default:
      return "";
  }
}

export function validateCustomerForm(form = {}) {
  return {
    nome: validateCustomerName(form.nome),
    telefone: validateCustomerPhone(form.telefone),
    cpf: validateCustomerCpf(form.cpf),
    email: validateCustomerEmail(form.email),
  };
}

export function hasCustomerFormErrors(errors = {}) {
  return Object.values(errors).some(Boolean);
}