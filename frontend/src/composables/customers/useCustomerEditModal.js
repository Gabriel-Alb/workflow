import { reactive, ref } from "vue";
import { atualizarCliente } from "@/services/clientes";
import {
  formatCpf,
  formatPhone,
  maskCpfInput,
  maskPhoneEditInput,
} from "@/utils/customer/customerMasks";
import {
  validateCustomerCpf,
  validateCustomerEmail,
  validateCustomerName,
} from "@/utils/customer/customerValidators";

export function useCustomerEditModal() {
  const isOpen = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref(false);

  const touchedFields = reactive({});
  const errors = reactive({
    nome: "",
    cpf: "",
    email: "",
  });

  const form = reactive({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    informacao_adicional: "",
  });

  const currentCustomer = ref(null);

  function openModal(customer) {
    if (!customer) return;

    currentCustomer.value = customer;

    Object.assign(form, {
      nome: customer.nome || "",
      telefone: formatPhone(customer.telefone || ""),
      cpf: formatCpf(customer.cpf || ""),
      email: customer.email || "",
      informacao_adicional: customer.informacao_adicional || "",
    });

    resetValidationState();
    errorMessage.value = "";
    successMessage.value = false;
    isOpen.value = true;
  }

  function closeModal() {
    isOpen.value = false;
  }

  function resetValidationState() {
    Object.keys(errors).forEach((key) => {
      errors[key] = "";
    });

    Object.keys(touchedFields).forEach((key) => {
      delete touchedFields[key];
    });
  }

  function touchField(field) {
    touchedFields[field] = true;
    validateField(field);
  }

  function validateField(field) {
    errors[field] = "";

    if (field === "nome") {
      errors.nome = validateCustomerName(form.nome);
    }

    if (field === "cpf") {
      errors.cpf = validateCustomerCpf(form.cpf);
    }

    if (field === "email") {
      errors.email = validateCustomerEmail(form.email);
    }

    return errors[field];
  }

  function validateForm() {
    ["nome", "cpf", "email"].forEach((field) => {
      touchedFields[field] = true;
      validateField(field);
    });

    return !Object.values(errors).some(Boolean);
  }

  function applyPhoneMask(event) {
    form.telefone = maskPhoneEditInput(event?.target?.value ?? form.telefone);
  }

  function applyCpfMask(event) {
    form.cpf = maskCpfInput(event?.target?.value ?? form.cpf);
  }

  async function saveChanges() {
    if (!currentCustomer.value) return null;
    if (!validateForm()) return null;

    errorMessage.value = "";
    successMessage.value = false;
    isLoading.value = true;

    try {
      const payload = {
        nome: form.nome.trim(),
        telefone: form.telefone.trim() || null,
        cpf: form.cpf ? form.cpf.replace(/\D/g, "") : null,
        email: form.email.trim() || null,
        informacao_adicional: form.informacao_adicional.trim() || null,
      };

      const updatedCustomer = await atualizarCliente(
        currentCustomer.value.id,
        payload,
      );

      currentCustomer.value = updatedCustomer;
      successMessage.value = true;

      setTimeout(() => {
        successMessage.value = false;
        closeModal();
      }, 1800);

      return updatedCustomer;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.response?.data?.erro;

      errorMessage.value =
        error?.response?.status === 409
          ? "CPF ou telefone já cadastrado em outro cliente."
          : message || "Erro ao salvar. Tente novamente.";

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isOpen,
    isLoading,
    errorMessage,
    successMessage,
    touchedFields,
    errors,
    form,
    currentCustomer,
    openModal,
    closeModal,
    touchField,
    validateField,
    validateForm,
    applyPhoneMask,
    applyCpfMask,
    saveChanges,
  };
}