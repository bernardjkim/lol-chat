const chatroom = require("./chatroom");

module.exports = function() {
  // mapping of all available chatrooms
  const defaultRoom = "default";
  const chatrooms = new Map();
  createChatroom(defaultRoom);

  function createChatroom(chatroomName) {
    chatrooms.set(chatroomName, chatroom(chatroomName));
  }

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
    createChatroom,
    removeClient,
    getChatroomByName,
    serializeChatrooms
  };
};
