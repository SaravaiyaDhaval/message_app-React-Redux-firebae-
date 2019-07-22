// Header.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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
};
class Header extends Component {
    constructor(props) {
        super(props);
        this.state ={
            
        }
    }
    handelLogout = () => {
        localStorage.removeItem('user');
        window.location = "/";
    }
    render() {
 
        const {title, user} = this.props;
        return (
            <div style={styles.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton  style={styles.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography style={styles.grow} variant="h6" color="inherit" >
                        {title}
                        </Typography>
                        {user}
                        {user &&<Button color="inherit" onClick={this.handelLogout}>Logout</Button>}
                        {/* <Button color="inherit">Ragister</Button> */}
                    </Toolbar>
            </AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(Header)