import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import pink from '@material-ui/core/colors/pink';
import _ from 'lodash';
const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    orangeAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: pink[500],
    },
    blueAvatar: {
        margin: 3,
        color: '#fff',
        backgroundColor: '#3f51b5',
    }
};
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            setOpen: false,
            selectedUser: ''
        }
    }
    componentWillReceiveProps() {

        let app = this.props.db.database().ref('user');
        app.on('value', snapshot => {
            this.getData(snapshot.val());

        });
        if (this.state.user == '') {
            this.props.getLoginUser(this.state.user)
        }

    }
    componentDidMount() {
        let app = this.props.db.database().ref('user');
        app.on('value', snapshot => {
            this.getData(snapshot.val());
        });

    }
    getData(values) {

        let { user } = this.props;
        let usersVal = values;
        let allUsers = _(usersVal)
            .keys()
            .map(userKey => {
                let cloned = _.clone(usersVal[userKey]);
                cloned.key = userKey;
                return cloned;
            })
            .value();
        this.setState({
            allUsers: allUsers
        });
        const findLoginUser = _.map(allUsers, 'user');
        const findLoginUserKey = _.map(allUsers, 'key');
        let loginUser = _.find(findLoginUser, { 'uid': user.uid });
        this.setState({
            user: loginUser,
        })
       
    }


    handleDrawerOpen = () => {
        this.setState({
            setOpen: true,
            open: true
        })

        let {user} = this.state;
        this.props.isDrowerOpen(true)

         if (user && user.uid) {
            let userId = user && user.uid
            user.isActive = true;
            this.props.db.database().ref('user/' + userId).set({
                user
            });
          
        }
    }

    handelLogout = () => {
        let { db } = this.props;
        const { user } = this.state;
        let userId = user && user.uid
        user.isActive = false;
        db.database().ref('user/' + userId).set({
            user
        });

        this.props.db.auth().signOut()
        window.location = "/";
    }
    handleDrawerClose = () => {
        this.setState({
            setOpen: false,
            open: false
        })
        this.props.isDrowerOpen(false)
    }
    handelOnHomeClick = () => {
        this.props.selectedUserForMsg('', '')
    }

    render() {

        const { setOpen, open, allUsers, user, selectedUser, } = this.state;
        const { title, db } = this.props;
        const AvatarText = user && user.fullName.match(/(?<=(\s|^))[a-z]/gi).join('').toUpperCase();
        return (
            <div >
                <CssBaseline />

                <AppBar
                    // position="fixed"
                    className={open ? "drower-header-open" : ""}
                >
                    <Toolbar disableGutters={!open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                        // style={styles.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography style={styles.grow} variant="h6" color="inherit" noWrap>
                            {title}
                            {user &&
                                <Button color="inherit" onClick={this.handelOnHomeClick}>Home</Button>}
                        </Typography>
                        {/* <div className='circle-Active'></div> */}
                         {user && user.fullName}
                        {AvatarText &&
                            <Avatar style={styles.orangeAvatar}>{AvatarText}</Avatar>}
                        {user && <Button color="inherit" onClick={this.handelLogout}>Logout</Button>}
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={open}
                    docked={true}
                    width="50%"

                >
                    <div className="left-drower-width" >
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {['general'].map((text, index) => (
                            <ListItem button={true} key={text} selected={selectedUser === text ? true : false} onClick={this.selectedUser = () => {
                                this.setState({
                                    selectedUser: text
                                })
                                this.props.selectedGenaralForMsg(text, user)
                            }
                            }>
                                <ListItemIcon>    <Avatar style={styles.blueAvatar}>{text.match(/(?<=(\s|^))[a-z]/gi).join('').toUpperCase()}</Avatar></ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <div className="left-drower-width">
                        <List>
                            {allUsers && allUsers.map((value, index) => (
                                <ListItem button={true} key={index} selected={selectedUser.fullName === value.user.fullName ? true : false} onClick={this.selectedUser = () => {
                                    this.setState({
                                        selectedUser: value.user
                                    })
                                    this.props.selectedUserForMsg(value.user, user)
                                }
                                }>
                                    <ListItemIcon><div className={value.user.isActive ? 'circle-Active': 'circle-unActive'}></div></ListItemIcon>
                                    <ListItemText primary={value && value.user.fullName} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default Sidebar;