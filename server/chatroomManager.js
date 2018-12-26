const chatroom = require("./chatroom");

const defaultRoom = "default";

module.exports = function() {
  // mapping of all available chatrooms
  const chatrooms = new Map();
  createChatroom(defaultRoom);

  // create a new chatroom with provided name
  function createChatroom(chatroomName) {
    chatrooms.set(chatroomName, chatroom(chatroomName));
  }

  // remove client with id from all chatrooms
  function removeClient(id) {
    chatrooms.forEach(c => c.removeClient(id));
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
