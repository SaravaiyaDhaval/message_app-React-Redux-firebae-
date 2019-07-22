// LoginRagister.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CustomizedSnackbars from './../_components/CustomizedSnackbars';
import _ from 'lodash';
import Modal from '@material-ui/core/Modal';
import { handleLoginDataChange, handleRagisterDataChange, handleForgotPasswordChange } from './../store/action/action';
import { stat } from 'fs';
const styles = {
    root: {
        flexGrow: 1,
        maxWidth: 500,
        margin: "20px auto"
    },
    buttonGridTopPadding: {
        paddingTop: '10px'
    },
};

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 2 }}>
            {props.children}
        </Typography>
    );
}

class LoginRagister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            isRagisterValid: false,
            isLoginValid: false,
            isModalOpen: false,
            isChangePasswordSubmited: false,
            changePasswordEmail: '',
            loginUser: {
                email: '',
                password: '',
            },
            ragisterUser: {
                uid: '',
                fullName: '',
                email: '',
                password: '',
                mobileNumber: '',
                isActive: true
            },
            isSnackbarOpen: false,
            snackbarMsg: '',
            snackbarType: ''
        }
    }
    handleTabChange = (event, activeTab) => {
        this.setState({
            activeTab
        })
    }
    handleLoginChange = (event) => {
        const { name, value } = event.target;
        const { loginUser } = this.state;
        let loginUserData = {
            ...loginUser,
            [name]: value,
        }

        if (loginUserData) {
            this.props.handleLoginDataChange(loginUserData);
        }
    }
    handleRagisterChange = (event) => {
        const { name, value } = event.target;
        const { ragisterUser } = this.state;

        let ragisterUserData = {
            ...ragisterUser,
            [name]: value,
        }

        if (ragisterUserData) {
            this.props.handleRagisterDataChange(ragisterUserData);
        }
    }
    HandleChangePasswordEmail = (event) => {
    
        let changePasswordEmail = event.target.value;

        if (changePasswordEmail) {
            this.props.handleForgotPasswordChange(changePasswordEmail);
        }
    }
    handleSnackbarClose = () => {
        this.setState({
            isSnackbarOpen: false
        })
    }
    handleModalClose = () => {
        this.setState({
            isModalOpen: false
        })
    }
    handleModalOpen = () => {
        this.setState({
            isModalOpen: true
        })
    }
    handleLogin = async (e) => {

        const { loginUser, user } = this.state;
        if (loginUser.email && loginUser.password) {
            this.props.db.auth().signInWithEmailAndPassword(loginUser.email, loginUser.password)
                .then((authUser) => {
                    if (authUser) {

                        this.setState({
                            isSnackbarOpen: true,
                            snackbarMsg: "Login Successfully",
                            snackbarType: 'success',
                            isLoginValid: true
                        }, () => {
                            setTimeout(() => {
                                this.setState(() => ({
                                    isSnackbarOpen: false,
                                    snackbarMsg: "",
                                }
                                ))
                            }, 5000);
                        })
                        window.location = "/"
                    }
                })
                .catch(error => {
                    this.setState({
                        isSnackbarOpen: true,
                        snackbarMsg: 'user Not Found',
                        snackbarType: 'error',
                        isLoginValid: true
                    }, () => {
                        setTimeout(() => {
                            this.setState(() => ({
                                isSnackbarOpen: false,
                                snackbarMsg: "",
                            }
                            ))
                        }, 5000);
                    })
                });
        }
        else {
            this.setState({
                isSnackbarOpen: true,
                snackbarMsg: 'Email And Password Are Required.',
                snackbarType: 'error',
                isLoginValid: true
            }, () => {
                setTimeout(() => {
                    this.setState(() => ({
                        isSnackbarOpen: false,
                        snackbarMsg: "",
                    }
                    ))
                }, 5000);
            })
        }
    }

    onPasswordReset = (e) => {
        e.preventDefault();
        const { changePasswordEmail } = this.state
        this.setState({ isChangePasswordSubmited: true })
        if (changePasswordEmail) {
            this.props.db.auth().sendPasswordResetEmail(changePasswordEmail).then((res) => {

            }).catch(function (error) {
            })
            this.setState({
                isSnackbarOpen: true,
                snackbarMsg: 'Email Send Successfully',
                snackbarType: 'success',
                changePasswordEmail: '',
                isChangePasswordSubmited: false,
                isModalOpen: false
            }, () => {
                setTimeout(() => {
                    this.setState(() => ({
                        isSnackbarOpen: false,
                        snackbarMsg: "",
                    }
                    ))
                }, 5000);
            })
        }
        else {
            this.setState({
                isSnackbarOpen: true,
                snackbarMsg: 'Email is Required',
                snackbarType: 'error'
            }, () => {
                setTimeout(() => {
                    this.setState(() => ({
                        isSnackbarOpen: false,
                        snackbarMsg: "",
                    }
                    ))
                }, 5000);
            })
        }
    }
    handleRagister = (e) => {
        e.preventDefault();
        const { ragisterUser } = this.state;

        if (ragisterUser.fullName && ragisterUser.email && ragisterUser.password && ragisterUser.mobileNumber) {


            this.props.db.auth().createUserWithEmailAndPassword(ragisterUser.email, ragisterUser.password).then((res) => {
                var uid = res.user.uid;
                ragisterUser.uid = uid

                this.props.db.database().ref('user/' + uid).set({
                    user: ragisterUser
                });
                ragisterUser.fullName = '';
                ragisterUser.email = '';
                ragisterUser.password = '';
                ragisterUser.mobileNumber = '';
                this.setState({
                    ragisterUser,
                    isSnackbarOpen: true,
                    snackbarMsg: 'Ragister SuccessFully',
                    snackbarType: 'success'
                }, () => {
                    setTimeout(() => {
                        this.setState(() => ({
                            isSnackbarOpen: false,
                            snackbarMsg: "",
                        }
                        ))
                    }, 5000);
                })
            })
                .catch(error => {
                    this.setState({
                        isSnackbarOpen: true,
                        snackbarMsg: "Something wrong !",
                        snackbarType: 'error'
                    }, () => {
                        setTimeout(() => {
                            this.setState(() => ({
                                isSnackbarOpen: false,
                                snackbarMsg: "",
                            }
                            ))
                        }, 5000);
                    })
                }
                );
        }
        else {
            this.setState({
                isSnackbarOpen: true,
                snackbarMsg: 'All Fields Are Required.',
                snackbarType: 'error',
                isRagisterValid: true
            }, () => {
                setTimeout(() => {
                    this.setState(() => ({
                        isSnackbarOpen: false,
                        snackbarMsg: "",
                    }
                    ))
                }, 5000);
            })
        }

    }
    handleLoginClear = () => {
        const { loginUser } = this.state;
        loginUser.email = '';
        loginUser.password = '';
        this.setState({
            isLoginValid: false,
            loginUser
        })

    }
    handleRagisterClear = () => {
        const { ragisterUser } = this.state;
        ragisterUser.fullName = '';
        ragisterUser.email = '';
        ragisterUser.password = '';
        ragisterUser.mobileNumber = '';
        this.setState({
            isRagisterValid: false,
            ragisterUser,
        })
    }

    
    componentDidUpdate(previousProps, previousState) {
        if (previousProps.loginUser !== this.props.loginUser) {
            let loginUser = this.props.loginUser
            this.setState({
                loginUser
            })
        }
        if (previousProps.ragisterUser !== this.props.ragisterUser) {
            let ragisterUser = this.props.ragisterUser
            this.setState({
                ragisterUser
            })
        }
        
        if (previousProps.changePasswordEmail !== this.props.changePasswordEmail) {
            let changePasswordEmail = this.props.changePasswordEmail
            this.setState({
                changePasswordEmail
            })
        }

    }
    render() {
        const { activeTab, loginUser, ragisterUser, isRagisterValid, isLoginValid, snackbarType, isSnackbarOpen, snackbarMsg, isModalOpen, isChangePasswordSubmited, changePasswordEmail } = this.state;
        return (

            <Paper square style={styles.root}>
                <AppBar position="static">
                    <Tabs
                        value={activeTab}
                        onChange={this.handleTabChange}
                        variant="fullWidth"
                        indicatorColor="secondary" >
                        <Tab label="Login" />
                        <Tab label="Ragister" />
                    </Tabs>
                </AppBar>
                {activeTab === 0 && <TabContainer>
                    <TextField
                        id="outlined-email-input"
                        label="Email"
                        type="email"
                        name="email"
                        value={loginUser && loginUser.email}
                        onChange={this.handleLoginChange}
                        autoComplete="email"
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={isLoginValid && !loginUser.email ? true : false}
                        helperText={isLoginValid && !loginUser.email ? 'Email is Required' : ''}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        name="password"
                        value={loginUser && loginUser.password}
                        onChange={this.handleLoginChange}
                        autoComplete="current-password"
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={isLoginValid && !loginUser.password ? true : false}
                        helperText={isLoginValid && !loginUser.password ? 'Password is Required' : ''}

                    />
                    <Grid container spacing={16} style={styles.buttonGridTopPadding}>
                        <Grid item xs={12} md={6}>
                            <Button variant="outlined" size="medium" fullWidth color="primary" onClick={this.handleLogin}>
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button variant="outlined" size="medium" fullWidth color="secondary" onClick={this.handleLoginClear} >
                                Reset
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={12} className="forgot-password-div">
                            <p onClick={this.handleModalOpen}> Forgot Your Password ?</p>
                        </Grid>
                    </Grid>
                </TabContainer>}


                {activeTab === 1 && <TabContainer>
                    <TextField
                        id="outlined-email-input"
                        label="Full Name"
                        type="text"
                        name="fullName"
                        value={ragisterUser && ragisterUser.fullName}
                        onChange={this.handleRagisterChange}
                        autoComplete="fullName"
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={isRagisterValid && !ragisterUser.fullName ? true : false}
                        helperText={isRagisterValid && !ragisterUser.fullName ? 'Full Name is Required' : ''}
                    />
                    <TextField
                        id="outlined-email-input"
                        label="Email"
                        type="email"
                        name="email"
                        value={ragisterUser && ragisterUser.email}
                        onChange={this.handleRagisterChange}
                        autoComplete="email"
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={isRagisterValid && !ragisterUser.email ? true : false}
                        helperText={isRagisterValid && !ragisterUser.email ? 'Email is Required' : ''}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        name="password"
                        value={ragisterUser && ragisterUser.password}
                        onChange={this.handleRagisterChange}
                        autoComplete="current-password"
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={isRagisterValid && !ragisterUser.password ? true : false}
                        helperText={isRagisterValid && !ragisterUser.password ? 'Password is Required' : ''}

                    />
                    <TextField
                        id="outlined-password-input"
                        label="Mobile Number"
                        type="number"
                        name="mobileNumber"
                        value={ragisterUser && ragisterUser.mobileNumber}
                        onChange={this.handleRagisterChange}
                        autoComplete="mobileNumber"
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={isRagisterValid && !ragisterUser.mobileNumber ? true : false}
                        helperText={isRagisterValid && !ragisterUser.mobileNumber ? 'Mobile Number is Required' : ''}

                    />

                    <Grid container spacing={16} style={styles.buttonGridTopPadding}>
                        <Grid item xs={12} md={6}>
                            <Button variant="outlined" size="medium" fullWidth color="primary" onClick={this.handleRagister}>
                                Apply
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button variant="outlined" size="medium" fullWidth color="secondary" onClick={this.handleRagisterClear}>
                                Reset
                            </Button>
                        </Grid>

                    </Grid>

                </TabContainer>}
                <CustomizedSnackbars
                    isSnackbarOpen={isSnackbarOpen}
                    snackbarMsg={snackbarMsg}
                    handleSnackbarClose={this.handleSnackbarClose}
                    verticalAlign="top"
                    horizontalAlign="right"
                    snackbarType={snackbarType}
                    isIconButtonCloseDisplay={true} />
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={isModalOpen}
                    onClose={this.handleModalClose}
                    className="modal-main-div"
                >
                    <Paper elevation={1} className="modal-center">
                        <Grid item xs={12} md={12}>
                            <Typography variant="h6" id="modal-title">
                                Forgot Your Password ?
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                To reset password, enter your email, press the button and check mail to follow instructions.
                            </Typography>
                        </Grid>

                        <Grid container spacing={16} style={styles.buttonGridTopPadding}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    id="outlined-email-input"
                                    // id="outlined-dense"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={changePasswordEmail}
                                    onChange={this.HandleChangePasswordEmail}
                                    autoComplete="email"
                                    margin="dense"
                                    variant="outlined"
                                    fullWidth
                                    error={isChangePasswordSubmited && !changePasswordEmail ? true : false}
                                    helperText={isChangePasswordSubmited && !changePasswordEmail ? 'Email is Required' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button variant="outlined" size="medium" fullWidth color="primary" onClick={this.onPasswordReset}>
                                    Apply
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button variant="outlined" size="medium" fullWidth color="secondary" onClick={this.handleModalClose}>
                                    Close
                            </Button>
                            </Grid>

                        </Grid>
                    </Paper>
                </Modal>
            </Paper>
        )
    }
}



function mapStateToProps(state) {
    return ({
        loginUser: state.loginUserReducer.loginUser,
        ragisterUser: state.ragisterUserReducer.ragisterUser,
        changePasswordEmail: state.forgotPasswordReducer.changePasswordEmail,
    })
}
function mapDispatchProps(dispatch) {
    return ({
        handleLoginDataChange: (loginUser) => {
            dispatch(handleLoginDataChange(loginUser))
        },
        handleRagisterDataChange: (ragisterUser) => {
            dispatch(handleRagisterDataChange(ragisterUser))
        },
        handleForgotPasswordChange: (changePasswordEmail) => {
            dispatch(handleForgotPasswordChange(changePasswordEmail))
        },
    })
}

export default connect(mapStateToProps, mapDispatchProps)(LoginRagister);
