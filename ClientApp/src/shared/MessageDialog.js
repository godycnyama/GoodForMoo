import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MessageDialog = (props) => {
  const { onClose, confirmMessage, description, open } = props;

  const handleClose = () => {
    onClose(confirmMessage);
  };

  const handleConfirm = value => {
    onClose(value);
  };


  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirm(true)} variant="contained" color="primary" style={{textTransform: 'none'}}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

MessageDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    confirmMessage: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
  };

export default MessageDialog