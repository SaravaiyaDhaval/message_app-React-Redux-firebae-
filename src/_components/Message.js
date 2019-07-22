// Message.js

import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ''
    };

  }

  handleDelete = () => {
    this.setState({
      id: 14
    })
  }
  render() {

    const { selectedUserForMsg, loginUserForMsg, messageList, message, } = this.props;
    var selectedId = selectedUserForMsg && selectedUserForMsg.uid;
    var loginId = loginUserForMsg && loginUserForMsg.uid;
    var R_uid = messageList && messageList.R_uid;
    var S_uid = messageList && messageList.S_uid;
    var AvatarText = messageList.SenderName.match(/(?<=(\s|^))[a-z]/gi).join('').toUpperCase();
    return (
      <div>
        <Chip
          color={R_uid == selectedId && S_uid == loginId ? "primary" : "secondary"}
          label={message}
          deleteIcon={<DoneIcon />}
          onDelete={this.handleDelete}
          avatar={<Avatar>{AvatarText}</Avatar>} />
        <div className={R_uid == selectedId && S_uid == loginId ? "sender-primery-text" : "sender-secondry-text"} >
          {messageList.SenderName}
        </div>
      </div>
    )
  }
}
export default Message