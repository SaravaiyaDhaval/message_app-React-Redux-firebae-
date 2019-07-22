// MessageBox.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import trim from 'trim';
import TextField from '@material-ui/core/TextField';
import MessageList from './MessageList';
import Zoom from 'react-reveal/Zoom';
import Bounce from 'react-reveal/Bounce';
import Flip from 'react-reveal/Flip';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Chart from './Chart';
import Picker from 'react-emojipicker'
import InputAdornment from '@material-ui/core/InputAdornment';
import { handleTextBoxChange, handleMessageListChange } from './../store/action/action';
class MessageBox extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.state = {
      message: {
        message: '',
        R_uid: '',
        S_uid: '',
        isGeneralMsg: false,
        SenderName: '',
      },
      isEmojisDisplay: false
    };
  }
  onChange(e) {
    const { message } = this.state;
    // message.message = e.target.value;
    // this.setState({
    //   message
    // })
    let messageData = {
      ...message,
      message: e.target.value
    }

    if (messageData) {
      this.props.handleTextBoxChange(messageData)
    }
  }
  onKeyup(e) {

    const { db, selectedUserForMsg, loginUserForMsg, user, allUsersList } = this.props;
    const { message } = this.state;
    message.S_uid = message.S_uid ? message.S_uid : user.uid;
    message.isGeneralMsg = message.R_uid == 'general' ? true : false;
    message.SenderName = loginUserForMsg && loginUserForMsg.fullName;
    if (e.keyCode === 13 && trim(e.target.value) !== '') {
      message.message = trim(e.target.value);
      this.setState({
        message
      })
      e.preventDefault();
      let dbCon = this.props.db.database().ref('/messages');
      dbCon.push({
        message: message,
      });
      message.message = '';
      this.setState({
        message
      });
    }
  }

  componentWillReceiveProps() {

    const { db, selectedUserForMsg, loginUserForMsg, user } = this.props;
    const { message,messages } = this.state;
    message.R_uid = selectedUserForMsg && selectedUserForMsg.uid;
    message.S_uid = loginUserForMsg && loginUserForMsg.uid;
    message.SenderName = loginUserForMsg && loginUserForMsg.fullName;
    this.setState({
      message
    })
    let app = this.props.db.database().ref('messages');
    app.on('value', snapshot => {
      this.getData(snapshot.val());
    });
    //     if(this.state.messages){
    // this.props.handleMessageListChange(this.state.messages)
    // }
  }

  componentDidMount() {
    const { db, selectedUserForMsg, loginUserForMsg } = this.props;
    const { message, messages } = this.state;
    message.R_uid = selectedUserForMsg && selectedUserForMsg.uid;
    message.S_uid = loginUserForMsg && loginUserForMsg.uid;
    this.setState({
      message
    })

    let app = this.props.db.database().ref('messages');
    app.on('value', snapshot => {
      this.getData(snapshot.val());
    });
  }
  getData(values) {
    let messagesVal = values;
    let messages = _(messagesVal)
      .keys()
      .map(messageKey => {
        let cloned = _.clone(messagesVal[messageKey]);
        cloned.key = messageKey;
        return cloned;
      })
      .value();
    this.setState({
      messages: messages
    });

    
  }
  logEmoji = (emoji) => {
    let { message } = this.state;

    let messageData = {
      ...message,
      message: message.message + emoji.unicode
    }

    if (messageData) {
      this.props.handleTextBoxChange(messageData)
    }
  }
  handleEmojisDisplay = () => {
    let { isEmojisDisplay } = this.state;
    this.setState({
      isEmojisDisplay: !isEmojisDisplay
    })
  }
  componentDidUpdate(previousProps, previousState) {
    debugger
    if (previousProps.message !== this.props.message) {
      let message = this.props.message
      this.setState({
        message
      })
    }
    if (previousProps.messages !== this.props.messages) {
      let messages = this.props.messages
      this.setState({
        messages
      })
    }

  }
  render() {

    const { db, selectedUserForMsg, loginUserForMsg, user, iOpen, } = this.props;
    const { messages, message, isEmojisDisplay } = this.state
    console.log('message', this.props.messages)
    return (
      <div>
        {selectedUserForMsg.uid ?
          <form>
            <Flip left>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                variant="outlined"
              >
                Send Message To <Icon>send</Icon>   {selectedUserForMsg && selectedUserForMsg.fullName}

              </Button>
            </Flip >
            <Flip bottom>
              <MessageList messages={messages} user={user} selectedUserForMsg={selectedUserForMsg} loginUserForMsg={loginUserForMsg} ></MessageList>
            </Flip >
            <Zoom bottom>
              <Bounce bottom>
                <div style={!isEmojisDisplay ? { display: 'none' } : ''}>
                  <Picker onEmojiSelected={this.logEmoji} />
                </div>
                <TextField
                  id="outlined-multiline-static"
                  label="Message"
                  multiline
                  onChange={this.onChange}
                  onKeyUp={this.onKeyup}
                  value={message.message}
                  rows="4"
                  defaultValue="Default Value"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" onClick={this.handleEmojisDisplay}>
                        <p className="emojis-div">😄</p>
                      </InputAdornment>
                    ),
                  }}
                />
              </Bounce>
            </Zoom>
          </form>
          :
          <div>
            <Chart db={db} selectedUserForMsg={selectedUserForMsg} loginUserForMsg={loginUserForMsg} user={user} />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return ({
    message: state.messageReducer.message,
    messages: state.messagesListReducer.messages,
  })
}
function mapDispatchProps(dispatch) {
  return ({
    handleTextBoxChange: (message) => {
      dispatch(handleTextBoxChange(message))
    },
    handleMessageListChange: (messages) => {
      dispatch(handleMessageListChange(messages))
    },
  })
}

export default connect(mapStateToProps, mapDispatchProps)(MessageBox);
