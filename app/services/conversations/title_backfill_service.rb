# frozen_string_literal: true

class Conversations::TitleBackfillService
  BATCH_SIZE = 1000

  def perform
    updated_count = 0

    # rubocop:disable Rails/SkipsModelValidations
    backfill_scope.in_batches(of: BATCH_SIZE) do |conversations|
      updated_count += conversations.update_all("title = conversations.additional_attributes->>'mail_subject'")
    end
    # rubocop:enable Rails/SkipsModelValidations

    updated_count
  end

  private

  def backfill_scope
    Conversation
      .joins(:inbox)
      .where(inboxes: { channel_type: 'Channel::Email' })
      .where("COALESCE(conversations.title, '') = ''")
      .where("NULLIF(BTRIM(conversations.additional_attributes->>'mail_subject'), '') IS NOT NULL")
  end
end
