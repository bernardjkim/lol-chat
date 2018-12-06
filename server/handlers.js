module.exports = function(client, clientManager, chatroomManager) {
  const handleEvent = makeHandleEvent(client, clientManager, chatroomManager);

  function handleRegister(username, callback) {
    if (!clientManager.isUserAvailable(username))
      return callback("user is not available");

    clientManager.registerClient(client, username);

    return callback(null, username);
  }

  function handleJoin(chatroomName, callback) {
    const createEntry = () => ({ event: `joined ${chatroomName}` });

    handleEvent(chatroomName, createEntry)
      .then(function(chatroom) {
        // add member to chatroom
        chatroom.addUser(client);

        // send chat history to client
        callback(null, chatroom.getChatHistory());
      })
      .catch(callback);
  }

  function handleLeave(chatroomName, callback) {
    const createEntry = () => ({ event: `left ${chatroomName}` });

    handleEvent(chatroomName, createEntry)
      .then(function(chatroom) {
        // remove member from chatroom
        chatroom.removeUser(client);

        callback(null);
      })
      .catch(callback);
  }

  function handleMessage({ chatroomName, msg } = {}, callback) {
    const createEntry = () => ({
      username: clientManager.getUserByClientId(client.id),
      msg
    });

    handleEvent(chatroomName, createEntry)
      .then(() => {})
      .catch(callback);
  }

  function handleGetChatrooms(_, callback) {
    return callback(null, chatroomManager.serializeChatrooms());
  }

  function handleGetAvailableUsers(_, callback) {
    return callback(null, clientManager.getAvailableUsers());
  }

  function handleDisconnect() {
    // remove user profile
    clientManager.removeClient(client);
    // remove member from all chatrooms
    chatroomManager.removeClient(client);
  }

  return {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleGetAvailableUsers,
    handleDisconnect
  };
};

function makeHandleEvent(client, clientManager, chatroomManager) {
  function ensureExists(getter, rejectionMessage) {
    return new Promise(function(resolve, reject) {
      const res = getter();
      return res ? resolve(res) : reject(rejectionMessage);
    });
  }

  function ensureUserSelected(clientId) {
    return ensureExists(
      () => clientManager.getUserByClientId(clientId),
      "select user first"
    );
  }

  function ensureValidChatroom(chatroomName) {
    return ensureExists(
      () => chatroomManager.getChatroomByName(chatroomName),
      `invalid chatroom name: ${chatroomName}`
    );
  }

  function ensureValidChatroomAndUserSelected(chatroomName) {
    return Promise.all([
      ensureValidChatroom(chatroomName),
      ensureUserSelected(client.id)
    ]).then(([chatroom, user]) => Promise.resolve({ chatroom, user }));
  }

  function handleEvent(chatroomName, createEntry) {
    return ensureValidChatroomAndUserSelected(chatroomName).then(function({
      chatroom,
      user
    }) {
      // append event to chat history
      const entry = { user, ...createEntry() };
      chatroom.addEntry(entry);

      // notify other clients in chatroom
      chatroom.broadcastMessage({ chat: chatroomName, ...entry });
      return chatroom;
    });
  }

  return handleEvent;
}
