import { nextTick, ref } from "vue";
import {
  atualizarCliente,
  buscarClientePorTelefone,
} from "@/services/clientes";
import {
  maskPhoneInput,
  onlyDigits,
} from "@/utils/customer/customerMasks";

export function useCustomerPhoneLink(form, options = {}) {
  const linkedCustomer = ref(null);
  const phoneSuggestion = ref(null);
  const originalPhone = ref("");
  const showReplacePhoneWarning = ref(false);

  const isSearchingByPhone = ref(false);
  const isReplacingPhone = ref(false);

  const {
    clearNameSuggestions = () => {},
    onLinkedCustomerChange = () => {},
  } = options;

  function getInitials(name = "") {
    return (
      String(name)
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0] || "")
        .join("")
        .toUpperCase() || "?"
    );
  }

  async function searchCustomerByPhone(digits) {
    isSearchingByPhone.value = true;

    try {
      const customer = await buscarClientePorTelefone(digits);
      phoneSuggestion.value = customer || null;
    } catch {
      phoneSuggestion.value = null;
    } finally {
      isSearchingByPhone.value = false;
    }
  }

  function clearPhoneState() {
    phoneSuggestion.value = null;
    showReplacePhoneWarning.value = false;
    isSearchingByPhone.value = false;
  }

  function linkCustomer(customer) {
    const formattedPhone = maskPhoneInput(customer?.telefone || "");

    linkedCustomer.value = customer;
    form.nome = customer?.nome || "";
    form.telefone = formattedPhone || customer?.telefone || "";

    originalPhone.value = form.telefone;
    phoneSuggestion.value = null;
    showReplacePhoneWarning.value = false;

    clearNameSuggestions();
    onLinkedCustomerChange(customer);
  }

  async function unlinkCustomer() {
    linkedCustomer.value = null;
    phoneSuggestion.value = null;
    originalPhone.value = "";
    showReplacePhoneWarning.value = false;

    form.telefone = "";
    form.nome = "";

    onLinkedCustomerChange(null);
    clearNameSuggestions();

    await nextTick();
    document.getElementById("telefone")?.focus();
  }

  async function handlePhoneInput(event) {
    const rawValue = event?.target?.value ?? form.telefone;
    const formattedPhone = maskPhoneInput(rawValue);
    const digits = onlyDigits(rawValue).slice(0, 11);

    form.telefone = formattedPhone;

    if (linkedCustomer.value) {
      phoneSuggestion.value = null;
      showReplacePhoneWarning.value = formattedPhone !== originalPhone.value;
      return;
    }

    phoneSuggestion.value = null;
    showReplacePhoneWarning.value = false;

    if (digits.length === 11) {
      await searchCustomerByPhone(digits);
    }
  }

  async function replaceLinkedCustomerPhone() {
    if (!linkedCustomer.value) return;

    isReplacingPhone.value = true;

    try {
      const updatedCustomer = await atualizarCliente(linkedCustomer.value.id, {
        ...linkedCustomer.value,
        telefone: form.telefone.trim() || null,
      });

      linkedCustomer.value = updatedCustomer;
      originalPhone.value = form.telefone;
      showReplacePhoneWarning.value = false;

      onLinkedCustomerChange(updatedCustomer);
    } catch {
      restoreOriginalPhone();
    } finally {
      isReplacingPhone.value = false;
    }
  }

  function restoreOriginalPhone() {
    form.telefone = originalPhone.value;
    showReplacePhoneWarning.value = false;
  }

  function resetPhoneLinkState() {
    linkedCustomer.value = null;
    phoneSuggestion.value = null;
    originalPhone.value = "";
    showReplacePhoneWarning.value = false;
    isSearchingByPhone.value = false;
    isReplacingPhone.value = false;
  }

  return {
    linkedCustomer,
    phoneSuggestion,
    originalPhone,
    showReplacePhoneWarning,
    isSearchingByPhone,
    isReplacingPhone,
    getInitials,
    handlePhoneInput,
    linkCustomer,
    unlinkCustomer,
    replaceLinkedCustomerPhone,
    restoreOriginalPhone,
    clearPhoneState,
    resetPhoneLinkState,
  };
}