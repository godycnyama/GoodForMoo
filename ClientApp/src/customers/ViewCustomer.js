import React from 'react';
import { Subscribe } from 'unstated';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import _CustomersContainer from './CustomersContainer';
import Transition from '../shared/Transition';

const ViewCustomer = () => (
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
              <Divider></Divider>
              <br></br>
              <p><b>Customer Name:</b> {selectedCustomer.customerName}</p>
              <p><b>Address:</b> {selectedCustomer.address}</p>
              <p><b>City/Town:</b> {selectedCustomer.town}</p>
              <p><b>Postal Code:</b> {selectedCustomer.postalCode}</p>
              <p><b>Province:</b> {selectedCustomer.province}</p>
              <p><b>Telephone:</b> {selectedCustomer.telephone}</p>
              <p><b>Mobile:</b> {selectedCustomer.mobile}</p>
              <p><b>Email:</b> {selectedCustomer.email}</p>
            </div>
          </Paper>
        </Grid>
      </Grid>
    )
  }}
  </Subscribe>
</Transition>
)

export default ViewCustomer
