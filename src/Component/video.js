import React from 'react';
import Variables from './variable_utils';
class VideoStream extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            localStream: this.props.localStream ? this.props.localStream : false,
            isStarted: false,
            connectionList: {
                // [id]: {
                //    pc: PeerConnection,
                //    stream: remote stream
                // }
            },
            remoteStreams: {},
            videoRefs: {},
        };

    }

  componentWillReceiveProps(nextProps) {
      if (nextProps.client) {
          nextProps.client.videoHandler(this.messageHandler);
      } 
      if (nextProps.localStream !== this.props.localStream) {
          this.setState({localStream: nextProps.localStream});
      }

  }

      maybeStart = clientId => {
          console.log(">>>>>>> maybeStart() ", this.state.localStream);
          if (this.state.localStream && !this.state.connectionList[clientId]) {
              console.log(">>>>>> creating peer connection");
              this.createPeerConnection(clientId);
              this.state.connectionList[clientId].addStream(this.state.localStream);
          }
      };

      createPeerConnection = clientId => {
          try {
              var pc = new RTCPeerConnection(Variables.pcConfig);
              pc.onicecandidate = this.handleIceCandidate;
              pc.onaddstream = this.handleRemoteStreamAdded(clientId);
              pc.onremovestream = this.handleRemoteStreamRemoved(clientId);

              this.setState({
                  connectionList: { ...this.state.connectionList,
                      [clientId]: pc
                  }
              });
              console.log("Created RTCPeerConnnection");
          } catch (e) {

              console.log("Failed to create PeerConnection, exception: " + e.message);
              alert("Cannot create RTCPeerConnection object.");
              return;
          }
      };

      handleIceCandidate = event => {
          console.log("icecandidate event: ", event);
          if (event.candidate) {
              this.props.client.sendMessage({
                  type: "candidate",
                  label: event.candidate.sdpMLineIndex,
                  id: event.candidate.sdpMid,
                  candidate: event.candidate.candidate
              });
          } else {
              console.log("End of candidates.");
          }
      };

      handleRemoteStreamAdded = (clientId) => event => {
          console.log("Remote stream added.");
          let new_State = Object.assign({
              [clientId]: event.stream
          }, this.state.remoteStreams, )
          this.setState({
              remoteStreams: new_State
          });
          // this.video.srcObject = event.stream;
      };

      handleRemoteStreamRemoved = (clientId) => event => {
          console.log("Remote stream removed. Event: ", event);
          var remoteStreams = this.state.remoteStreams;
          delete remoteStreams[clientId];
          this.setState({
              remoteStreams
          });
      };

      handleCreateOfferError(event) {
          console.log("createOffer() error: ", event);
      }

      doCall = clientId => {
          console.log("Sending offer to peer");

          this.state.connectionList[clientId].createOffer(
              this.setLocalAndSendMessage(clientId),
              this.handleCreateOfferError
          );
      };

      setLocalAndSendMessage = clientId => sessionDescription => {
          console.log("set local description for: ", clientId);
          this.state.connectionList[clientId].setLocalDescription(sessionDescription);
          console.log("setLocalAndSendMessage sending message", sessionDescription);
          this.props.client.sendMessage(sessionDescription);
      };

      onCreateSessionDescriptionError(error) {
          console.log("Failed to create session description: " + error.toString());
          // trace("Failed to create session description: " + error.toString());
      }

      doAnswer = clientId => {
          console.log("Sending answer to peer.");
          this.state.connectionList[clientId]
              .createAnswer()
              .then(
                  this.setLocalAndSendMessage(clientId),
                  this.onCreateSessionDescriptionError
              );
      };

      handleRemoteHangup = clientId => {
          console.log("Session terminated.");
          this.stop(clientId);
      };

      stop = clientId => {
          var pc = this.state.connectionList[clientId];
          if (pc) {
              pc.close();
              var connectionList = this.state.connectionList;
              delete connectionList[clientId];
              this.setState({
                  connectionList
              });
          }
      };

      // This client receives a message
      messageHandler = message => {
          console.log("Client received message:", message);
          if (message.type === "joined") {
              if (!this.state.connectionList[message.clientId]) {
                  this.maybeStart(message.clientId);
    
                  this.doCall(message.clientId);
              }
          } else if (message.type === "offer") {
              if (!this.state.connectionList[message.clientId]) {
                  this.maybeStart(message.clientId);

                  this.state.connectionList[message.clientId].setRemoteDescription(
                      new RTCSessionDescription(message)
                  );
                  this.doAnswer(message.clientId);
              }
          } else if (message.type === "answer") {
              if (
                  this.state.connectionList[message.clientId] &&
                  !this.state.connectionList[message.clientId].remoteDescription
              ) {
                  this.state.connectionList[message.clientId].setRemoteDescription(
                      new RTCSessionDescription(message)
                  );
              }
          } else if (message.type === "candidate") {
              var candidate = new RTCIceCandidate({
                  sdpMLineIndex: message.label,
                  candidate: message.candidate
              });
              if (this.state.connectionList[message.clientId]) {
                  this.state.connectionList[message.clientId].addIceCandidate(candidate);
              }
          } else if (message === "bye") {
              this.handleRemoteHangup(message.clientId);
          }
      };

      render() {
          return ( 
                <div id="videos">
                    {Object.keys(this.state.remoteStreams).map(clientId => (
                        <video
                        key={clientId}
                        autoPlay
                        playsInline
                        ref={ref => {
                            ref
                            ? (ref.srcObject = this.state.remoteStreams[clientId])
                            : (ref = null);
                        }}
                        />
                    ))}
                </div>
          );
      }

}

export default VideoStream;