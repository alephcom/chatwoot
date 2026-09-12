# frozen_string_literal: true

# Run with:
#   bundle exec rake chatwoot:backfill_conversation_titles

namespace :chatwoot do
  desc 'Backfill conversation titles from email subjects'
  task backfill_conversation_titles: :environment do
    scope = Conversation
            .joins(:inbox)
            .where(inboxes: { channel_type: 'Channel::Email' })
            .where("COALESCE(conversations.title, '') = ''")
            .where("NULLIF(BTRIM(conversations.additional_attributes->>'mail_subject'), '') IS NOT NULL")

    updated_count = 0

    # rubocop:disable Rails/SkipsModelValidations
    scope.in_batches(of: 1000) do |conversations|
      updated_count += conversations.update_all("title = conversations.additional_attributes->>'mail_subject'")
    end
    # rubocop:enable Rails/SkipsModelValidations

    puts "Backfilled #{updated_count} conversation titles."
  end
end
