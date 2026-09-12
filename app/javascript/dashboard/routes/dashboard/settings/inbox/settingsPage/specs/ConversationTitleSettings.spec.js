import { shallowMount, flushPromises } from '@vue/test-utils';
import { createStore } from 'vuex';
import ConversationTitleSettings from '../ConversationTitleSettings.vue';
import SettingsToggleSection from 'dashboard/components-next/Settings/SettingsToggleSection.vue';

vi.mock('dashboard/composables', () => ({
  useAlert: vi.fn(),
}));

const updateInbox = vi.fn();

const mountComponent = (inbox = {}) => {
  const store = createStore({
    modules: {
      inboxes: {
        namespaced: true,
        actions: { updateInbox },
      },
    },
  });

  return shallowMount(ConversationTitleSettings, {
    props: {
      inbox: {
        id: 1,
        enable_conversation_title: false,
        ...inbox,
      },
    },
    global: {
      plugins: [store],
      mocks: { $t: key => key },
    },
  });
};

describe('ConversationTitleSettings', () => {
  it('persists the updated inbox setting', async () => {
    updateInbox.mockResolvedValue();
    const wrapper = mountComponent();

    wrapper
      .findComponent(SettingsToggleSection)
      .vm.$emit('update:modelValue', true);
    await flushPromises();

    expect(updateInbox).toHaveBeenCalledWith(expect.anything(), {
      id: 1,
      formData: false,
      enable_conversation_title: true,
    });
  });
});
