import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Subscribe } from 'unstated';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button  from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import NumberFormat from 'react-number-format';
import _CustomersContainer from './CustomersContainer';
import Transition from '../shared/Transition';

const ViewCustomer = () => {
  const history = useHistory();
  const location = useLocation();
  
  return (
    <Transition>
      <Subscribe to = {[_CustomersContainer]}>
      { customersStore => {
        const { state: { selectedCustomer }} = customersStore;
  
        return (
          <Grid container>
            <Grid item xs={12} lg={6}>
              <Paper>
                <div style={{margin: 15}}>
                  <Typography variant="h6" >
                      View Customer
                  </Typography>
                  <Divider/>
                  <Button
                    variant="contained" 
                    color="primary"
                    style={{marginLeft: 15, marginTop: 15, textTransform: 'none'}}
                    startIcon={<ArrowBackIcon/>}
                    onClick={() => { history.goBack()}}>
                      Back
                  </Button>
                  <br/>
                  <p><b>Customer Name:</b> {location.state.CustomerName}</p>
                  <p><b>Address:</b> {location.state.Address}</p>
                  <p><b>City/Town:</b> {location.state.Town}</p>
                  <p><b>Postal Code:</b> {location.state.PostalCode}</p>
                  <p><b>Province:</b> {location.state.Province}</p>
                  <p><b>Telephone:</b> {location.state.Telephone}</p>
                  <p><b>Mobile:</b> {location.state.Mobile}</p>
                  <p><b>Email:</b> {location.state.Email}</p>
                </div>
              </Paper>
            </Grid>
          </Grid>
        )
      }}
      </Subscribe>{}
    </Transition>
    )
}

export default ViewCustomer
