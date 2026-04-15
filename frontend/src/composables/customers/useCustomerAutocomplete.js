import { onBeforeUnmount, ref, watch } from "vue";
import { listarClientes } from "@/services/clientes";

export function useCustomerAutocomplete(customerNameRef, linkedCustomerRef) {
  const isSearchingByName = ref(false);
  const nameSuggestions = ref([]);

  let searchTimer = null;

  function clearNameSuggestions() {
    nameSuggestions.value = [];
  }

  function clearSearchTimer() {
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = null;
    }
  }

  async function searchCustomersByName(query) {
    isSearchingByName.value = true;

    try {
      const response = await listarClientes({
        q: query,
        limit: 6,
        page: 1,
      });

      nameSuggestions.value = response?.data || [];
    } catch (error) {
      console.error("[customer autocomplete]", error);
      nameSuggestions.value = [];
    } finally {
      isSearchingByName.value = false;
    }
  }

  watch(
    customerNameRef,
    (value) => {
      if (linkedCustomerRef?.value) {
        clearNameSuggestions();
        clearSearchTimer();
        isSearchingByName.value = false;
        return;
      }

      clearNameSuggestions();
      clearSearchTimer();

      const query = String(value || "").trim();

      if (query.length < 2) {
        isSearchingByName.value = false;
        return;
      }

      isSearchingByName.value = true;

      searchTimer = setTimeout(() => {
        searchCustomersByName(query);
      }, 350);
    },
    { immediate: false },
  );

  onBeforeUnmount(() => {
    clearSearchTimer();
  });

  return {
    isSearchingByName,
    nameSuggestions,
    clearNameSuggestions,
  };
}