import { shallowMount } from '@vue/test-utils';
import ConversationCardExpanded from '../ConversationCardExpanded.vue';

const defaultChat = {
  id: 1,
  labels: [],
  messages: [],
  unread_count: 0,
  timestamp: 1700000000,
  created_at: 1700000000,
};

const mountComponent = (chat, inbox) =>
  shallowMount(ConversationCardExpanded, {
    props: {
      chat: { ...defaultChat, ...chat },
      currentContact: { name: 'Jane Doe' },
      inbox: { id: 1, ...inbox },
    },
  });

describe('ConversationCardExpanded', () => {
  it('shows the enabled title and keeps the contact name', () => {
    const wrapper = mountComponent(
      { title: 'Billing question' },
      { enable_conversation_title: true }
    );

    expect(wrapper.find('h4').text()).toContain('Billing question');
    expect(wrapper.find('h4').text()).toContain('Jane Doe');
  });

  it('renders the existing contact line when titles are disabled or blank', () => {
    const disabledWrapper = mountComponent(
      { title: 'Billing question' },
      { enable_conversation_title: false }
    );
    const blankWrapper = mountComponent(
      { title: null },
      { enable_conversation_title: true }
    );

    expect(disabledWrapper.find('h4').text()).toBe('Jane Doe');
    expect(blankWrapper.find('h4').text()).toBe('Jane Doe');
  });
});
