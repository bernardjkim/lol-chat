module.exports = function(name) {
  const members = new Map();
  let chatHistory = [];

  function broadcastMessage(message) {
    members.forEach(m => m.emit("chat-message", message));
  }

  function addEntry(entry) {
    chatHistory = chatHistory.concat(entry);
  }

  function getChatHistory() {
    return chatHistory.slice();
  }

  function addUser(client) {
    members.set(client.id, client);
  }

  function removeUser(client) {
    members.delete(client.id);
  }

  function serialize() {
    return {
      name,
      numMembers: members.size
    };
  }

  return {
    broadcastMessage,
    addEntry,
    getChatHistory,
    addUser,
    removeUser,
    serialize
  };
};
