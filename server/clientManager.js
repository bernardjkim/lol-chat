module.exports = function() {
  // mapping of all connected clients
  const clients = new Map();

  function addClient(client) {
    clients.set(client.id, { client });
  }

  function registerClient(client, username) {
    clients.set(client.id, { client, username });
  }

  function removeClient(client) {
    clients.delete(client.id);
  }

  function getAvailableUsers() {
    return Array.from(clients.values());
  }

  function isUserAvailable(username) {
    return getAvailableUsers().some(u => u.nickname === username);
  }

  function getUserByName(username) {
    return clients.find(u => u.username === username);
  }

  function getUserByClientId(clientId) {
    return (clients.get(clientId) || {}).username;
  }

  return {
    addClient,
    registerClient,
    removeClient,
    getAvailableUsers,
    isUserAvailable,
    getUserByName,
    getUserByClientId
  };
};
