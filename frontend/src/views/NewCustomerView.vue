<template>
  <AppLayout>
    <section
      class="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <div class="mx-auto w-full max-w-[1680px]">
        <BasePageTitle
          class="mb-8"
          title="Novo cliente"
          description="Preencha os dados do cliente com atenção. Apenas o nome é obrigatório."
        />

        <CustomerForm :loading="loading" @submit="handleSubmit" />
      </div>
    </section>

    <BaseToastContainer>
      <BaseToast
        v-model="toast.visible"
        :variant="toast.variant"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
      />
    </BaseToastContainer>

    <BaseModal
      v-model="successModalOpen"
      title="Cliente cadastrado com sucesso"
      description="Deseja abrir uma nova O.S. para este cliente?"
      confirm-text="Sim"
      cancel-text="Não"
      @confirm="handleOpenNewOs"
    >
      <template #icon>
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/70"
        >
          <span
            class="mdi mdi-check-circle text-[34px] text-emerald-500"
          ></span>
        </div>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "@/components/base/BaseModal.vue";
import BasePageTitle from "@/components/base/BasePageTitle.vue";
import BaseToast from "@/components/base/BaseToast.vue";
import BaseToastContainer from "@/components/base/BaseToastContainer.vue";
import CustomerForm from "@/components/layouts/customer/CustomerForm.vue";
import { criarCliente } from "@/services/clientes";

const router = useRouter();

const loading = ref(false);
const successModalOpen = ref(false);
const createdCustomer = ref(null);

const toast = reactive({
  visible: false,
  variant: "warning",
  title: "",
  message: "",
  duration: 4500,
});

function showToast({ variant, title, message, duration = 4500 }) {
  toast.visible = false;

  requestAnimationFrame(() => {
    toast.variant = variant;
    toast.title = title;
    toast.message = message;
    toast.duration = duration;
    toast.visible = true;
  });
}

function showWarning(message) {
  showToast({
    variant: "warning",
    title: "Atenção",
    message,
  });
}

function showError(message) {
  showToast({
    variant: "error",
    title: "Erro",
    message,
  });
}

function buildPayload(form) {
  return {
    nome: form.nome.trim(),
    telefone: form.telefone.trim(),
    cpf: form.cpf.replace(/\D/g, ""),
    email: form.email.trim() || null,
    informacao_adicional: form.informacao_adicional.trim() || null,
  };
}

function extractErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.erro || "";
}

async function saveCustomer(payload) {
  return await criarCliente(payload);
}

async function handleSubmit(form) {
  loading.value = true;

  try {
    const payload = buildPayload(form);
    const customer = await saveCustomer(payload);

    createdCustomer.value = customer;
    successModalOpen.value = true;
  } catch (err) {
    const status = err?.response?.status;
    const message = extractErrorMessage(err);

    if (status === 409) {
      showWarning(
        message || "Atenção, o CPF deste usuário já está cadastrado.",
      );
      return;
    }

    if (status === 422) {
      showWarning(message || "Verifique os dados enviados e tente novamente.");
      return;
    }

    showError(
      message || "Não foi possível comunicar com o servidor. Tente novamente.",
    );
  } finally {
    loading.value = false;
  }
}

function handleOpenNewOs() {
  if (!createdCustomer.value) {
    successModalOpen.value = false;
    return;
  }

  successModalOpen.value = false;

  router.push({
    path: "/new-os",
    query: {
      cliente_id: createdCustomer.value.id,
      nome: createdCustomer.value.nome,
    },
  });
}
</script>
