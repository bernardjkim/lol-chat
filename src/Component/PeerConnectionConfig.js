/**
 * pc configs
 * STUN/TURN servers
 */

export default {
  iceServers: [
    {
      urls: [process.env.STUN_SERVER]
    },
    {
      urls: [process.env.TURN_SERVER],
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_PASSWORD
    }
  ]
};
