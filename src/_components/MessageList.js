import React, { Component } from 'react';
import Message from './Message';
import _ from 'lodash';
import Fade from 'react-reveal/Fade';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  render() {

    const { selectedUserForMsg, loginUserForMsg, user } = this.props;
    let messageNodes = this.props.messages && this.props.messages.map((message) => {
      var messageList = message && message.message;
      var selectedId = selectedUserForMsg ? selectedUserForMsg.uid : 'general';
      var loginId = loginUserForMsg ? loginUserForMsg.uid : user && user.uid;
      if (messageList.R_uid == selectedId && messageList.S_uid == loginId || messageList.R_uid == loginId && messageList.S_uid == selectedId || selectedId == 'general' && messageList.isGeneralMsg == true) {
        return (
          <div className={messageList.R_uid == selectedId && messageList.S_uid == loginId ? "message-align-right" : "message-align-left"}>
            <div className="message-box">
              <Fade top>
                <div>
                  <Fade right>
                    <div >
                      <Message
                        message={messageList.message}
                        messageList={messageList}
                        selectedUserForMsg={selectedUserForMsg}
                        loginUserForMsg={loginUserForMsg}
                      />
                    </div>
                  </Fade>
                </div>
              </Fade>
            </div>
          </div>
        )
      }
    });
    return (
      <div>
        {selectedUserForMsg && messageNodes}
      </div>
    );
  }
}

export default MessageList
