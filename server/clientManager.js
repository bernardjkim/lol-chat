module.exports = function() {
  // mapping of all connected clients
  const clients = new Map();

  function addClient(client) {
    clients.set(client.id, { client });
  }

  function registerClient(client, username) {
    var user = getUserByClientId(client.id);
    if (!user) {
      clients.set(client.id, { client, username, room: "default" });
    } else {
      clients.set(client.id, { client, username, room: user.room });
    }
  }

  function joinRoom(client, room) {
    var user = getUserByClientId(client.id);
    clients.set(client.id, {
      client: user.client,
      username: user.username,
      room
    });
  }

  function removeClient(client) {
    clients.delete(client.id);
  }

  function getAvailableUsers() {
    return Array.from(clients.values());
  }

  function isUserAvailable(username) {
    return !getAvailableUsers().some(u => u.username === username);
  }

  function getUserByName(username) {
    return clients.find(u => u.username === username);
  }

  function getUserByClientId(clientId) {
    return clients.get(clientId) || {};
  }

  return {
    addClient,
    registerClient,
    joinRoom,
    removeClient,
    getAvailableUsers,
    isUserAvailable,
    getUserByName,
    getUserByClientId
  };
};
