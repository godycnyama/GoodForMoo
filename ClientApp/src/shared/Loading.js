import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import LoadingSpinner from '../assets/images/Rolling-1s-200px.svg';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Loading = (props) => {
  const { open } = props;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
            <Box alignItems="center">
                <img src={LoadingSpinner} alt="Logo"/>
                <p style={{textAlign: 'center', color: "#2F2F4F",fontSize: "20px"}}>Please wait...</p>
            </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

Loading.propTypes = {
    open: PropTypes.bool.isRequired,
  };

export default Loading