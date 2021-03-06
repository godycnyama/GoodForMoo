﻿import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Subscribe } from 'unstated';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button  from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
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

const ViewOrder = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    let _orderDetails = [];

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
      _orderDetails = [...getOrderDetailsData.value];
    }

  const updateOrder = () => {
    let items = [];
    for(let i=0; i < _orderDetails.length; i++){
      //const { OrderID, OrderDetailID, ..._item } = item;
      let _item = {
        ProductID: _orderDetails[i].ProductID,
        ProductName: _orderDetails[i].ProductName,
        UnitPrice: _orderDetails[i].UnitPrice,
        Quantity: _orderDetails[i].Quantity,
        UnitOfMeasure: _orderDetails[i].UnitOfMeasure,
        Currency: _orderDetails[i].Currency
      }
      items.push(_item);
    }

    history.push('/update-order-products', {...location.state, orderDetails: items});
  }

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
                      <Button
                        variant="contained" 
                        color="primary"
                        style={{marginLeft: 15, marginTop: 15, textTransform: 'none'}}
                        startIcon={<EditIcon/>}
                        onClick={() => { updateOrder()}}>
                          Edit Order
                      </Button>
                      <br/>
                      <p><b>Order ID:</b> {location.state.OrderID}</p>
                      <p><b>Customer Name:</b> {location.state.Customer.CustomerName}</p>
                      <p><b>Order SubTotal:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={location.state.SubTotal} displayType={'text'} prefix={location.state.Currency} /></p>
                      <p><b>Order Tax:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={location.state.Tax} displayType={'text'} prefix={location.state.Currency} /></p>
                      <p><b>Order Total:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={location.state.Total} displayType={'text'} prefix={location.state.Currency} /></p>
                      <p><b>Order Date:</b> {location.state.OrderDate}</p>
                      <p><b>Delivery Date:</b> {location.state.DeliveryDate}</p>
                      <p><b>Delivery Address:</b> {location.state.DeliveryAddress}</p>
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
                            {_orderDetails.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {row.ProductID}
                                </TableCell>
                                <TableCell>
                                    {row.ProductName}
                                </TableCell>
                                <TableCell>
                                    <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={row.UnitPrice} displayType={'text'} prefix={row.Currency} />
                                </TableCell>
                                <TableCell>
                                    {row.Quantity} {row.UnitOfMeasure}
                                </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                  <Loading open={getOrderDetailsLoading} />
                  </Paper>
                </Grid>
              </Grid>
            )
          }}
          </Subscribe>
        </Transition>
        )
}

export default ViewOrder
