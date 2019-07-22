
import React, {Component} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
class CustomizedSnackbars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSnackbarOpen: this.props.isSnackbarOpen,
            snackbarMsg: this.props.snackbarMsg

        };
    }

    render() {
        const { classes } = this.props;
        const snackbarDesign = this.props.snackbarType  == "success" ?   {backgroundColor: '#43a047' } :
            this.props.snackbarType  == "error" ? {backgroundColor: '#d32f2f' } :
            this.props.snackbarType  == "warning" ? {backgroundColor: '#f9a002' } : {backgroundColor: '#2276d2' } ;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: this.props.verticalAlign,
                    horizontal: this.props.horizontalAlign ,
                }}
                open={this.props.isSnackbarOpen}
                autoHideDuration={6000}
                // onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                    style: snackbarDesign ,
                }}
                message={
                    <span id="client-snackbar"  >
                        {this.props.snackbarType == "success"  && <CheckCircleIcon/>}
                        {this.props.snackbarType == "error"  && <ErrorIcon/>}
                        {this.props.snackbarType == "Info"  && <InfoIcon/>}
                        {this.props.snackbarType == "warning"  && <WarningIcon/>}
                        {this.props.snackbarMsg}
                        </span>
                }
                action={[
                        this.props.isIconButtonCloseDisplay &&
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.props.handleSnackbarClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                ]}>

            </Snackbar>
        );
    }
}

export default CustomizedSnackbars;
