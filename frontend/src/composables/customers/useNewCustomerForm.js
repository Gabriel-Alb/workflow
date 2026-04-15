import { computed, nextTick, reactive, ref } from "vue";
import { criarCliente } from "@/services/clientes";
import { maskCpfInput } from "@/utils/customer/customerMasks";
import {
  hasCustomerFormErrors,
  validateCustomerField,
  validateCustomerForm,
} from "@/utils/customer/customerValidators";

export function useNewCustomerForm() {
  const step = ref("form");
  const loading = ref(false);
  const globalError = ref("");
  const createdCustomer = ref(null);

  const touchedFields = reactive({});
  const form = reactive({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    informacao_adicional: "",
  });

  const errors = reactive({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
  });

  const isSuccessStep = computed(() => step.value === "success");
  const isFormStep = computed(() => step.value === "form");

  function setFieldValue(field, value) {
    form[field] = value;
  }

  function touchField(field) {
    touchedFields[field] = true;
    validateField(field);
  }

  function validateField(field) {
    errors[field] = validateCustomerField(field, form);
    return errors[field];
  }

  function validateForm() {
    const validatedErrors = validateCustomerForm(form);

    Object.keys(validatedErrors).forEach((field) => {
      touchedFields[field] = true;
      errors[field] = validatedErrors[field];
    });

    return !hasCustomerFormErrors(validatedErrors);
  }

  function applyCpfMask(event) {
    form.cpf = maskCpfInput(event?.target?.value ?? form.cpf);
  }

  function clearFormState() {
    Object.assign(form, {
      nome: "",
      telefone: "",
      cpf: "",
      email: "",
      informacao_adicional: "",
    });

    Object.keys(errors).forEach((key) => {
      errors[key] = "";
    });

    Object.keys(touchedFields).forEach((key) => {
      delete touchedFields[key];
    });

    globalError.value = "";
  }

  async function submitForm() {
    globalError.value = "";

    if (!validateForm()) {
      return false;
    }

    loading.value = true;

    try {
      const payload = {
        nome: form.nome.trim(),
        telefone: form.telefone.trim() || null,
        cpf: form.cpf ? form.cpf.replace(/\D/g, "") : null,
        email: form.email.trim() || null,
        informacao_adicional: form.informacao_adicional.trim() || null,
      };

      createdCustomer.value = await criarCliente(payload);
      step.value = "success";

      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.response?.data?.erro;

      if (error?.response?.status === 409) {
        globalError.value =
          message || "Telefone ou CPF já cadastrado em outro cliente.";
      } else if (error?.response?.status === 422) {
        globalError.value = message || "Verifique os campos e tente novamente.";
      } else {
        globalError.value = "Erro ao cadastrar. Tente novamente.";
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  async function resetForm() {
    clearFormState();
    createdCustomer.value = null;
    step.value = "form";

    await nextTick();
    document.getElementById("telefone")?.focus();
  }

  function setCreatedCustomer(customer) {
    createdCustomer.value = customer;
  }

  function setStep(value) {
    step.value = value;
  }

  return {
    step,
    loading,
    globalError,
    createdCustomer,
    touchedFields,
    form,
    errors,
    isSuccessStep,
    isFormStep,
    setFieldValue,
    touchField,
    validateField,
    validateForm,
    applyCpfMask,
    submitForm,
    resetForm,
    setCreatedCustomer,
    setStep,
  };
}
