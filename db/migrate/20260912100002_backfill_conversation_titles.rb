class BackfillConversationTitles < ActiveRecord::Migration[7.1]
  def up
    Conversations::TitleBackfillService.new.perform
  end

  def down
    # no-op: do not wipe titles that may have been edited after upgrade
  end
end
