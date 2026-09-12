import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import ConversationHeader from '../ConversationHeader.vue';
import InlineInput from 'dashboard/components-next/inline-input/InlineInput.vue';

vi.mock('vue-router', async importOriginal => ({
  ...(await importOriginal()),
  useRoute: () => ({ params: {}, name: 'home' }),
}));

vi.mock('dashboard/composables/useInbox', () => ({
  useInbox: () => ({ isAWebWidgetInbox: { value: false } }),
}));

vi.mock('shared/helpers/clipboard', () => ({
  copyTextToClipboard: vi.fn(),
}));

const buildStore = ({ title = 'Billing question', enabled = true } = {}) => {
  const chat = {
    id: 1,
    inbox_id: 2,
    title,
    status: 'open',
    meta: { sender: { id: 3 } },
  };
  const updateConversationTitle = vi.fn();
  const store = createStore({
    state: { chat },
    getters: {
      getSelectedChat: state => state.chat,
      getCurrentAccountId: () => 1,
    },
    actions: {
      updateConversationTitle,
    },
    modules: {
      contacts: {
        namespaced: true,
        getters: {
          getContact: () => () => ({
            name: 'Jane Doe',
            thumbnail: '',
            availability_status: 'offline',
          }),
        },
      },
      inboxes: {
        namespaced: true,
        getters: {
          getInbox: () => () => ({
            id: 2,
            enable_conversation_title: enabled,
          }),
          getInboxes: () => [],
        },
      },
    },
  });

  return { store, chat, updateConversationTitle };
};

const mountComponent = options => {
  const { store, chat, updateConversationTitle } = buildStore(options);
  const wrapper = shallowMount(ConversationHeader, {
    props: { chat },
    global: {
      plugins: [store],
      mocks: { $t: key => key },
      stubs: { 'fluent-icon': true },
    },
  });

  return { wrapper, updateConversationTitle };
};

describe('ConversationHeader', () => {
  it('renders the contact name unchanged when titles are disabled', () => {
    const { wrapper } = mountComponent({ enabled: false });

    expect(wrapper.text()).toContain('Jane Doe');
    expect(wrapper.text()).not.toContain('Billing question');
  });

  it('saves an edited title through the conversations action', async () => {
    const { wrapper, updateConversationTitle } = mountComponent();
    const titleButton = wrapper
      .findAll('button')
      .find(button => button.text().includes('Billing question'));

    await titleButton.trigger('click');
    const input = wrapper.findComponent(InlineInput);
    input.vm.$emit('update:modelValue', 'Updated title');
    await input.vm.$emit('enterPress');

    expect(updateConversationTitle).toHaveBeenCalledWith(expect.anything(), {
      conversationId: 1,
      title: 'Updated title',
    });
  });
});
