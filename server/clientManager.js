module.exports = function() {
  // mapping of all connected clients
  const clients = new Map();

  /* 
  client {
    socket,
    username,
    room,
    language,
    ...
  }*/

  // add client by socket id
  function addClient(id, user) {
    clients.set(id, user);
  }

  // get client by id
  function getClient(id) {
    return clients.get(id) || false;
  }

  // remove client by id
  function removeClient(id) {
    clients.delete(id);
  }

  // get list of client ids
  function getClientList() {
    return Array.from(clients.keys());
  }

  return {
    addClient,
    getClient,
    removeClient,
    getClientList
  };
};
