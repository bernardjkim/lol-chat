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
<<<<<<< HEAD
    return getAvailableUsers().some(u => u.username === username);
=======
    return getAvailableUsers().some(u => u.username !== username);
>>>>>>> a8bd4ac0a7e4ce31b7c71bc193c348c93e03cfec
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
