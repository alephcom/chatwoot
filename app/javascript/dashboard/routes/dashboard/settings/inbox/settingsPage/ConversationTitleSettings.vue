<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useAlert } from 'dashboard/composables';
import SettingsToggleSection from 'dashboard/components-next/Settings/SettingsToggleSection.vue';

const props = defineProps({
  inbox: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const { t } = useI18n();
const enabled = ref(false);

watch(
  () => [props.inbox.id, props.inbox.enable_conversation_title],
  () => {
    enabled.value = props.inbox.enable_conversation_title || false;
  },
  { immediate: true }
);

const updateSetting = async value => {
  try {
    await store.dispatch('inboxes/updateInbox', {
      id: props.inbox.id,
      formData: false,
      enable_conversation_title: value,
    });
    useAlert(t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
  } catch (error) {
    enabled.value = !value;
    useAlert(t('INBOX_MGMT.EDIT.API.ERROR_MESSAGE'));
  }
};
</script>

<template>
  <SettingsToggleSection
    v-model="enabled"
    :header="$t('INBOX_MGMT.SETTINGS_POPUP.ENABLE_CONVERSATION_TITLE')"
    :description="
      $t('INBOX_MGMT.SETTINGS_POPUP.ENABLE_CONVERSATION_TITLE_SUB_TEXT')
    "
    @update:model-value="updateSetting"
  />
</template>
