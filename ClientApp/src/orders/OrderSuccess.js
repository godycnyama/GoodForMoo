import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Subscribe } from 'unstated';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button  from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Table, TableHead, TableBody,TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import useAxios from 'axios-hooks';
import { BASE_URL } from '../shared/Constants';
import _OrdersContainer from './OrdersContainer';
import Transition  from '../shared/Transition';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    }
  })

const OrderSuccess = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    console.log(location.state);
    let orderDetails = [];
    /*
    const [{data: getOrderDetailsData, loading: getOrderDetailsLoading, error: getOrderDetailsError }, executeOrderDetailsGet] = useAxios({
      url: BASE_URL,
      method: "GET"
    },{
        manual: true
    });

    const getOrderDetails = () => {
      executeOrderDetailsGet({
        method: 'get',
        url: BASE_URL + `/api/orderDetails?$filter=OrderID eq ${location.state.OrderID}`,
       })
    }

    useEffect(() => {
      getOrderDetails();
    },[]);

    if(getOrderDetailsError) {
      console.log(getOrderDetailsError.response);
      openToast("error", getOrderDetailsError.response.data.message );
    }

    if(getOrderDetailsData) {
      console.log(getOrderDetailsData);
      orderDetails = [...getOrderDetailsData.value];
    }
    */
    return (
        <Transition>
          <Subscribe to = {[_OrdersContainer]}>
          { ordersStore => {
            const { state: { selectedOrder }} = ordersStore;
            return (
              <Grid container>
                <Grid item xs={12} lg={8}>
                  <Paper>
                    <div style={{margin: 15}}>
                      <Typography variant="h6" >
                          Order Summary
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
                      <p><b>Order ID:</b> {location.state.orderID}</p>
                      <p><b>Customer Name:</b> {location.state.customer.customerName}</p>
                      <p><b>Order SubTotal:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={location.state.subTotal} displayType={'text'} prefix={location.state.currency} /></p>
                      <p><b>Order Tax:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={location.state.tax} displayType={'text'} prefix={location.state.currency} /></p>
                      <p><b>Order Total:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={location.state.total} displayType={'text'} prefix={location.state.currency} /></p>
                      <p><b>Order Date:</b> {location.state.orderDate}</p>
                      <p><b>Delivery Date:</b> {location.state.deliveryDate}</p>
                      <p><b>Delivery Address:</b> {location.state.deliveryAddress}</p>
                    </div>
                    <br/>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>      
                            </TableHead>
                            <TableBody>
                            {location.state.orderDetails.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {row.productID}
                                </TableCell>
                                <TableCell>
                                    {row.productName}
                                </TableCell>
                                <TableCell>
                                    <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={row.unitPrice} displayType={'text'} prefix={row.currency} />
                                </TableCell>
                                <TableCell>
                                    {row.quantity} {row.unitOfMeasure}
                                </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                  </Paper>
                </Grid>
              </Grid>
            )
          }}
          </Subscribe>
        </Transition>
        )
}

export default OrderSuccess
