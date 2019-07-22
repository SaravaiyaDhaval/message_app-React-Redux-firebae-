import React from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import _ from 'lodash';
import Fade from 'react-reveal/Fade';
var userIdList = [];
class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPieSend: {
        labels: ["users"],
        datasets: [
          {
            data: [10],
            backgroundColor: [
              "#F7464A",
              "#46BFBD",
              "#FDB45C",
              "#949FB1",
              "#4D5360",
              "#ac64ad"
            ],
            hoverBackgroundColor: [
              "#FF5A5E",
              "#5AD3D1",
              "#FFC870",
              "#A8B3C5",
              "#616774",
              "#da92db"
            ]
          }
        ]
      },
      dataPieRecive: {
        labels: ["users"],
        datasets: [
          {
            data: [10],
            backgroundColor: [
              "#F7464A",
              "#46BFBD",
              "#FDB45C",
              "#949FB1",
              "#4D5360",
              "#ac64ad"
            ],
            hoverBackgroundColor: [
              "#FF5A5E",
              "#5AD3D1",
              "#FFC870",
              "#A8B3C5",
              "#616774",
              "#da92db"
            ]
          }
        ]
      },
      totalSenderMsg: [],
      totalReciverMsg: [],
      dataLineSend: {
        labels: ['users'],
        datasets: [
          {
            label: 'Message Send',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [100]
          },
        ]

      }
    }
  }

  componentWillReceiveProps() {
    let userApp = this.props.db.database().ref('user');
    userApp.on('value', snapshot => {
      this.getUserData(snapshot.val());
    });

    let messageApp = this.props.db.database().ref('messages');
    messageApp.on('value', snapshot => {
      this.getMessageData(snapshot.val());
    });

    this.setState({
      dataPieSend: {
        datasets: [
          {
            data: this.state.totalSenderMsg,
          }
        ]
      },
      dataLineSend: {
        datasets: [
          {
            label: 'Message Send',
            data: this.state.totalSenderMsg,
            fill: true,
          },
          {
            label: 'Message Receive',
            data: this.state.totalReciverMsg,
            // fill: false,
            lineTension: 0.1,
            backgroundColor: '#f6464a6e',
            borderColor: '#f6464a',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#f6464a',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#f6464a',
            pointHoverBorderColor: '#f6464a',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          }
        ]
      },
      dataPieRecive: {
        datasets: [
          {
            data: this.state.totalReciverMsg,
          }
        ]
      },
    })

  }
  componentDidMount() {
    let userApp = this.props.db.database().ref('user');
    userApp.on('value', snapshot => {
      this.getUserData(snapshot.val());
    });

    let messageApp = this.props.db.database().ref('messages');
    messageApp.on('value', snapshot => {
      this.getMessageData(snapshot.val());
    });

  }
  getUserData(values) {
    var { dataPieSend, dataPieRecive, dataLineSend } = this.state;
    let usersVal = values;
    let allUsers = _(usersVal)
      .keys()
      .map(userKey => {
        let cloned = _.clone(usersVal[userKey]);
        cloned.key = userKey;
        return cloned;
      })
      .value();
    var usersList = _.map(allUsers, 'user');
    var fullNameList = _.map(usersList, 'fullName');
    userIdList = _.map(usersList, 'uid');
    dataPieSend.labels = fullNameList;
    dataPieRecive.labels = fullNameList;
    dataLineSend.labels = fullNameList;
    this.setState({
      dataPieSend,
      dataPieRecive,
      dataLineSend,
    })

  }
  getMessageData(values) {

    var { totalSenderMsg, totalReciverMsg, dataLineSend } = this.state;
    let messagesVal = values;
    let messages = _(messagesVal)
      .keys()
      .map(messageKey => {
        let cloned = _.clone(messagesVal[messageKey]);
        cloned.key = messageKey;
        return cloned;
      })
      .value();
    const messageList = _.map(messages, 'message');
    //   const messageListIDwise =  this.state.idList ? _.find(messageList, function(o)  {return  o.S_uid  === this.state.idList[1]; }) : '';

    if (totalSenderMsg.length === 0) {

      userIdList && userIdList.map((uid, i) => {
        var usersSendMessage = _.filter(messageList, ['S_uid', uid]);
        var msgSendLength = usersSendMessage.length;
        totalSenderMsg.push(msgSendLength);

        var usersReciveMessage = _.filter(messageList, ['R_uid', uid]);
        var msgReciveLength = usersReciveMessage.length;
        totalReciverMsg.push(msgReciveLength);
      })

      this.setState({
        totalSenderMsg,
        totalReciverMsg,
      })
    }


  }
  render() {
    const { dataPieSend, messageList, totalSenderMsg, dataPieRecive, dataLineSend, } = this.state;
    return (
      // <MDBContainer>
      <MDBRow>
        <MDBCol md="6" sm="12" xs="12">
          <Fade top>
            <h3 className="mt-5">Message Records Data (Line chart)</h3>
            <Line ref="chart" data={dataLineSend} />
          </Fade>
        </MDBCol>
        <MDBCol md="6" sm="12" xs="12">
          <Fade top>
            <h3 className="mt-5">Message Records Data (Bar chart)</h3>
            <Bar ref="chart" data={dataLineSend} />
          </Fade>
        </MDBCol>
        <MDBCol md="6" sm="12" xs="12">
          <Fade right >
            <h3 className="mt-5">Message Send (Pie chart)</h3>
            <Pie data={dataPieSend} options={{ responsive: true }} />
          </Fade>
        </MDBCol>
        <MDBCol md="6" sm="12" xs="12">
          <Fade left>
            <h3 className="mt-5">Message Receive (Pie chart) </h3>
            <Pie data={dataPieRecive} options={{ responsive: true }} />
          </Fade>
        </MDBCol>

      </MDBRow>
    );
  }
}

export default Chart;