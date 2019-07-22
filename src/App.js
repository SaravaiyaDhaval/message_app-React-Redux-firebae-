import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import firebase from 'firebase';
import Header from './_components/Header';
import MessageList from './_components/MessageList';
import MessageBox from './_components/MessageBox';
import LoginRagister from './_pages/LoginRagister';
import Sidebar from './_components/Sidebar';
import Chart from './_components/Chart';
import {Provider} from 'react-redux';
import store from './store/index';
class App extends Component {
  constructor(props) {
    super(props);
    var config = {
      apiKey: "AIzaSyBuoa4WiCbM-qjH3CYGFG-SE7zX9skfQOQ",
      authDomain: "graphql-firebase-95872.firebaseapp.com",
      databaseURL: "https://graphql-firebase-95872.firebaseio.com",
      projectId: "graphql-firebase-95872",
      storageBucket: "graphql-firebase-95872.appspot.com",
      messagingSenderId: "167847388669"
    };
    firebase.initializeApp(config);
    this.state = {
      iOpen: false,
      user: '',
      allUsersList: [],
      selectedUserForMsg: {
        email: "",
        fullName: "General Meassage",
        mobileNumber: "",
        password: "",
        uid: "",
      }
    }

  }
  async componentDidMount() {

    await this.isAuthorizedUser()
  }
  async componentWillReceiveProps() {
    await this.isAuthorizedUser()
  }

  isAuthorizedUser = async () => {
    await firebase.auth().onAuthStateChanged((AuthUser) => {

      if (AuthUser) {
        this.setState({
          user: AuthUser
        })
      }
    });
  }

  isDrowerOpen = (action) => {
    this.setState({
      iOpen: action
    })
  }
  selectedUserForMsg = (selectedUserForMsg, loginUserForMsg) => {
    this.setState({
      selectedUserForMsg,
      loginUserForMsg
    })
  }
  selectedGenaralForMsg = (selectedUserId, loginUserForMsg) => {
    const { selectedUserForMsg } = this.state;
    selectedUserForMsg.uid = selectedUserId;
    selectedUserForMsg.fullName = 'General Meassage'
    this.setState({
      selectedUserForMsg,
      loginUserForMsg
    })
  }
  getLoginUser = (loginUserForMsg) => {
    this.setState({
      loginUserForMsg
    })
  }

  render() {

    const { iOpen, user, selectedUserForMsg, loginUserForMsg, } = this.state;
    return (
      <Provider store={store}>
      <Router>
        <div className="react-firebase-demo">
          {!user && <Header title="Live Chat" user={user} />}
          {user && <Sidebar title="Live Chat" user={user} db={firebase} getLoginUser={this.getLoginUser} selectedGenaralForMsg={this.selectedGenaralForMsg} selectedUserForMsg={this.selectedUserForMsg} isDrowerOpen={this.isDrowerOpen} />}
          <div className={user ? !iOpen ? "drowerClose" : "drowerActive" : ''}>
            <Route exact={user ? true : false} path="/" component={user ? () => <MessageBox user={user} iOpen={iOpen} loginUserForMsg={loginUserForMsg} selectedUserForMsg={selectedUserForMsg} db={firebase} /> : () => <LoginRagister db={firebase} />} />
            {user && <Route path="/MessageList" component={() => <MessageList db={firebase} />} />}
            {user && <Route path="/MessageBox" component={() => <MessageBox loginUserForMsg={loginUserForMsg} selectedUserForMsg={selectedUserForMsg} db={firebase} />} />}
          </div>

        </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
