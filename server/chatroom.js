module.exports = function(name) {
  const members = new Map();
  let chatHistory = [];

  function broadcastMessage(message) {
    members.forEach(m => m.client.emit("chat-message", message));
  }

  function broadcastMembers() {
    var usernames = [];
    members.forEach(m => {
      usernames.push(m.username);
    });

    members.forEach(m => m.client.emit("members", usernames));
  }

  function addEntry(entry) {
    chatHistory = chatHistory.concat(entry);
  }

  function getChatHistory() {
    return chatHistory.slice();
  }

  function addUser(client, username) {
    members.set(client.id, {
      client: client,
      username: username
    });
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
    broadcastMembers,
    addEntry,
    getChatHistory,
    addUser,
    removeUser,
    serialize
  };
};
