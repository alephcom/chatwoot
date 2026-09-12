require 'rails_helper'

RSpec.describe Conversations::TitleBackfillService do
  let(:account) { create(:account) }
  let(:email_inbox) { create(:inbox, :with_email, account: account) }
  let(:widget_inbox) { create(:inbox, account: account) }
  let!(:email_conversation) do
    create(:conversation, account: account, inbox: email_inbox, additional_attributes: { 'mail_subject' => 'Refund request' })
  end
  let!(:titled_conversation) do
    create(
      :conversation,
      account: account,
      inbox: email_inbox,
      title: 'Agent supplied title',
      additional_attributes: { 'mail_subject' => 'Original email subject' }
    )
  end
  let!(:blank_subject_conversation) do
    create(:conversation, account: account, inbox: email_inbox, additional_attributes: { 'mail_subject' => '' })
  end
  let!(:non_email_conversation) do
    create(:conversation, account: account, inbox: widget_inbox, additional_attributes: { 'mail_subject' => 'Widget subject' })
  end

  it 'backfills only blank email conversation titles and is idempotent' do
    expect(described_class.new.perform).to eq(1)

    expect(email_conversation.reload.title).to eq('Refund request')
    expect(titled_conversation.reload.title).to eq('Agent supplied title')
    expect(blank_subject_conversation.reload.title).to be_nil
    expect(non_email_conversation.reload.title).to be_nil

    expect(described_class.new.perform).to eq(0)
  end
end
