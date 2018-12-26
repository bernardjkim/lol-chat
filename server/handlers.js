module.exports = function(socket, clientManager, chatroomManager) {
  /**
   * handleRegister will update the clients username or create a new client. The
   * chatroom will broadcast an updated members list.
   *
   * @param {string}    username
   * @param {function}  callback
   */
  function handleRegister(username = "default", callback = () => {}) {
    var client = clientManager.getClient(socket.id);
    // update username or create new client
    if (client) {
      client.username = username;
    } else {
      client = { socket, username, language: "en" };
      clientManager.addClient(socket.id, client);
    }

    // broardcast members
    if (client.room) {
      chatroomManager.getChatroomByName(client.room).broadcastMembers();
    }

    return callback(null, username);
  }

  /**
   * handleJoin will remove client from prvious chatroom and join the new
   * chatroom provided. The chatroom will broadcast its updated members list.
   *
   * @param {string}    chatroomName
   * @param {function}  callback
   */
  function handleJoin(chatroomName = "default", callback = () => {}) {
    var client = clientManager.getClient(socket.id);
    // leave previous chatroom
    handleLeave(client.room);

    // create new room if room with chatroomName does not exist
    if (!chatroomManager.getChatroomByName(chatroomName)) {
      chatroomManager.createChatroom(chatroomName);
    }

    var chatroom = chatroomManager.getChatroomByName(chatroomName);
    // add client to chatroom and broadcast members
    chatroom.addClient(socket.id, client);
    chatroom.broadcastMembers();
    client.room = chatroomName;

    // send chat history to client
    callback(null, chatroom.getChatHistory());
  }

  /**
   * handleLanguage will update the clients language preference
   *
   * @param {string}    language
   * @param {function}  callback
   */
  function handleLanguage(language, callback = () => {}) {
    clientManager.getClient(socket.id).language = language;
  }

  /**
   * handleLeave will remove the client from the specified chatroom and
   * broadcast the updated client list to the chatroom.
   *
   * @param {string}    chatroomName
   * @param {function}  callback
   */
  function handleLeave(chatroomName, callback = () => {}) {
    var chatroom = chatroomManager.getChatroomByName(chatroomName);
    if (chatroom) {
      chatroom.removeClient(socket.id);
      chatroom.broadcastMembers();
    }
  }

  /**
   * handleMessage handles incoming messages and broadcasts the msg to clients
   * in the specified chatroom.
   *
   * @param {object}    message   contains chatroom and msg text
   * @param {function}  callback
   */
  function handleMessage({ chatroomName, msg } = {}, callback = () => {}) {
    var client = clientManager.getClient(socket.id);
    var entry = { username: client.username, msg };
    var chatroom = chatroomManager.getChatroomByName(chatroomName);

    // append event to chat history
    chatroom.addEntry(entry);

    // notify other clients in chatroom
    chatroom.broadcastMessage({ chat: chatroomName, ...entry });
  }

  /**
   * handleDisconnect will remove the client from the chatroom and remove user
   * profile.
   */
  function handleDisconnect() {
    // remove from chatroom
    handleLeave(clientManager.getClient(socket.id).room);
    // remove user profile
    clientManager.removeClient(socket.id);
  }

  return {
    handleRegister,
    handleJoin,
    handleLanguage,
    handleLeave,
    handleMessage,
    handleDisconnect
  };
};
