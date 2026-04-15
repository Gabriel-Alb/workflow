export function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

export function maskPhoneInput(value = "") {
  const digits = onlyDigits(value).slice(0, 11);

  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskPhoneEditInput(value = "") {
  const digits = onlyDigits(value).slice(0, 11);

  if (!digits) return "";
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*$/, (_, ddd, part1, part2) => {
        let result = "";

        if (ddd) result += `(${ddd}`;
        if (ddd.length === 2) result += ")";
        if (part1) result += ` ${part1}`;
        if (part2) result += `-${part2}`;

        return result;
      })
      .trim();
  }

  return digits
    .replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*$/, (_, ddd, part1, part2) => {
      let result = "";

      if (ddd) result += `(${ddd}`;
      if (ddd.length === 2) result += ")";
      if (part1) result += ` ${part1}`;
      if (part2) result += `-${part2}`;

      return result;
    })
    .trim();
}

export function maskCpfInput(value = "") {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
}

export function formatPhone(value = "") {
  return maskPhoneEditInput(value);
}

export function formatCpf(value = "") {
  return maskCpfInput(value);
}