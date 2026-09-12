# frozen_string_literal: true

# Run with:
#   bundle exec rake chatwoot:backfill_conversation_titles
#
# Upgrade path: db:migrate also runs this via BackfillConversationTitles.

namespace :chatwoot do
  desc 'Backfill conversation titles from email subjects'
  task backfill_conversation_titles: :environment do
    updated_count = Conversations::TitleBackfillService.new.perform
    puts "Backfilled #{updated_count} conversation titles."
  end
end
