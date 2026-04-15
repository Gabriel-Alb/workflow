<template>
  <div class="mx-auto w-full max-w-[1680px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
    <transition name="success-fade">
      <NewCustomerSuccessSection
        v-if="isSuccessStep"
        :customer="createdCustomer"
        @reset="handleReset"
        @edit="openEditModal"
      />
    </transition>

    <transition name="etapa">
      <FormSection
        v-if="isFormStep"
        :form="form"
        :errors="errors"
        :touched-fields="touchedFields"
        :global-error="globalError"
        :loading="loading"
        :linked-customer="linkedCustomer"
        :phone-suggestion="phoneSuggestion"
        :original-phone="originalPhone"
        :show-replace-phone-warning="showReplacePhoneWarning"
        :is-searching-by-phone="isSearchingByPhone"
        :is-replacing-phone="isReplacingPhone"
        :is-searching-by-name="isSearchingByName"
        :name-suggestions="nameSuggestions"
        @submit="submitForm"
        @update-field="handleUpdateField"
        @touch-field="touchField"
        @phone-input="handlePhoneInput"
        @cpf-input="applyCpfMask"
        @link-customer="handleLinkCustomer"
        @unlink-customer="handleUnlinkCustomer"
        @replace-phone="replaceLinkedCustomerPhone"
        @restore-phone="restoreOriginalPhone"
      />
    </transition>

    <CustomerEditModal
      :is-open="isEditModalOpen"
      :loading="isEditModalLoading"
      :error-message="editModalErrorMessage"
      :success-message="editModalSuccessMessage"
      :form="editForm"
      :errors="editErrors"
      :touched-fields="editTouchedFields"
      @close="closeEditModal"
      @save="handleSaveEdit"
      @touch-field="touchEditField"
      @update-field="handleUpdateEditField"
      @phone-input="applyEditPhoneMask"
      @cpf-input="applyEditCpfMask"
    />
  </div>
</template>

<script setup>
import { toRef } from "vue";
import CustomerEditModal from "../components/customer/CustomerEditModal.vue";
import FormSection from "../components/customer/FormSection.vue";
import NewCustomerSuccessSection from "../components/customer/NewCustomerSuccessSection.vue";
import { useCustomerAutocomplete } from "@/composables/customers/useCustomerAutocomplete";
import { useCustomerEditModal } from "@/composables/customers/useCustomerEditModal";
import { useCustomerPhoneLink } from "@/composables/customers/useCustomerPhoneLink";
import { useNewCustomerForm } from "@/composables/customers/useNewCustomerForm";

const {
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
  applyCpfMask,
  submitForm,
  resetForm,
  setCreatedCustomer,
} = useNewCustomerForm();

let clearNameSuggestionsRef = () => {};

const {
  linkedCustomer,
  phoneSuggestion,
  originalPhone,
  showReplacePhoneWarning,
  isSearchingByPhone,
  isReplacingPhone,
  handlePhoneInput,
  linkCustomer,
  unlinkCustomer,
  replaceLinkedCustomerPhone,
  restoreOriginalPhone,
  resetPhoneLinkState,
} = useCustomerPhoneLink(form, {
  clearNameSuggestions: () => clearNameSuggestionsRef(),
});

const { isSearchingByName, nameSuggestions, clearNameSuggestions } =
  useCustomerAutocomplete(toRef(form, "nome"), linkedCustomer);

clearNameSuggestionsRef = clearNameSuggestions;

const {
  isOpen: isEditModalOpen,
  isLoading: isEditModalLoading,
  errorMessage: editModalErrorMessage,
  successMessage: editModalSuccessMessage,
  touchedFields: editTouchedFields,
  errors: editErrors,
  form: editForm,
  openModal,
  closeModal,
  touchField: touchEditField,
  applyPhoneMask: applyEditPhoneMask,
  applyCpfMask: applyEditCpfMask,
  saveChanges,
} = useCustomerEditModal();

function handleUpdateField(field, value) {
  setFieldValue(field, value);
}

function handleUpdateEditField(field, value) {
  editForm[field] = value;
}

function handleLinkCustomer(customer) {
  linkCustomer(customer);
}

async function handleUnlinkCustomer() {
  await unlinkCustomer();
}

function openEditModal() {
  openModal(createdCustomer.value);
}

async function handleSaveEdit() {
  const updatedCustomer = await saveChanges();

  if (updatedCustomer) {
    setCreatedCustomer(updatedCustomer);
  }
}

async function handleReset() {
  await resetForm();
  resetPhoneLinkState();
  clearNameSuggestions();
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.22s ease;
}

.slide-down-leave-active {
  transition: all 0.15s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.etapa-enter-active {
  transition: all 0.28s ease;
}

.etapa-leave-active {
  transition: all 0.18s ease;
}

.etapa-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.etapa-leave-to {
  opacity: 0;
}

.success-fade-enter-active {
  transition: all 0.4s ease;
}

.success-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>