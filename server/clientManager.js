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
  function setClient(id, user) {
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

  // check if client with id exists
  function clientExists(id) {
    return !getClientList().some(client_id => client_id === id);
  }

  return {
    setClient,
    getClient,
    removeClient,
    getClientList,
    clientExists
  };
};
