class AddEnableConversationTitleToInboxes < ActiveRecord::Migration[7.1]
  def change
    add_column :inboxes, :enable_conversation_title, :boolean, default: false, null: false
  end
end
