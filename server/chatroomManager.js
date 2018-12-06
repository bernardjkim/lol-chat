const chatroom = require("./chatroom");

module.exports = function() {
  // mapping of all available chatrooms
  const defaultRoom = "default";
  const chatrooms = new Map();
  chatrooms.set(defaultRoom, chatroom(defaultRoom));

  function removeClient(client) {
    chatrooms.forEach(c => c.removeUser(client));
  }

  function getChatroomByName(chatroomName) {
    return chatrooms.get(chatroomName);
  }

  function serializeChatrooms() {
    return Array.from(chatrooms.values()).map(c => c.serialize());
  }

  return {
    removeClient,
    getChatroomByName,
    serializeChatrooms
  };
};
