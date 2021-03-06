// const translate = require("./translate");

module.exports = function(name) {
  const members = new Map();
  let chatHistory = [];

  // broadcast the message to the chatroom
  function broadcastMessage(message) {
    members.forEach(m => {
      m.socket.emit("chat-message", message);

      // NOTE: disabled translate for now... google translate api cost $$$
      // translate(message.msg, m.language).then(translation => {
      //   message.msg = translation;
      //   m.socket.emit("chat-message", message);
      // });
    });
  }

  // broadcast the list of members to the chatroom
  function broadcastMembers() {
    var usernames = [];
    members.forEach(m => {
      usernames.push(m.username);
    });

    members.forEach(m => m.socket.emit("members", usernames));
  }

  // append entry to chat history
  function addEntry(entry) {
    chatHistory = chatHistory.concat(entry);
  }

  // return chat history
  function getChatHistory() {
    return chatHistory.slice();
  }

  // add <id, client> mapping
  function addClient(id, client) {
    members.set(id, client);
  }

  // remove user by id
  function removeClient(id) {
    members.delete(id);
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
    addClient,
    removeClient,
    serialize
  };
};
