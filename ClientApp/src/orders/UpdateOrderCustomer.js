import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { DatePicker } from 'material-ui-formik-components/DatePicker';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Subscribe } from 'unstated';
import _OrdersContainer from './OrdersContainer';
import Transition  from '../shared/Transition';
import { BASE_URL } from '../shared/Constants';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';
import useAxios from 'axios-hooks';

const orderStatusOptions = [
    'Pending',
    'Complete'
  ]

const UpdateOrderCustomer = () => {
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [openLoading, setOpenLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    //const BASE_URL = `${window.location.protocol}//${window.location.host}`

    
    const history = useHistory();
    const location = useLocation();
    let customers = [...location.state.customers];

    const [{data: putData, loading: putLoading, error: putError}, executePatch] = useAxios({
        url: BASE_URL,
        method: "PATCH"
    },{
        manual: true
    });

    const updateOrder = (orderData) => {
        executePatch({
            method: 'patch',
            url: BASE_URL + `/api/orders(${location.state.OrderID})`,
            data: {
              ...orderData,
              orderDetails: [...location.state.orderDetails]
            }})
    }

    /*
    const openMessageDialog = () => {
        setMessageDescription("Customer created successfully!");
        setOpenMessage(true);
    };

    const openLoadingDialog = () => {
        setOpenLoading(true);
    };
    */
    const handleMessageClose = value => {
        setOpenMessage(false);
        setConfirmMessage(value);
    };

    if(putError) {
        openToast("error", putError.response.data.message);
    }

    if(putData) {
        openToast("success", putData.message );
        history.push('/order-success', {...putData.order});
    }
    
return (
  <Transition>
    <Subscribe to = {[_OrdersContainer]}>
      {ordersStore => {
        const { state: { selectedOrder }} = ordersStore;
        let title = `Update Order#: ${location.state.OrderID} Customer Details`;
        return (
         <Grid container>
          <Grid item xs={12} lg={6}>
           <Paper>
            <Formik
                initialValues={{ 
                    customerID: location.state.CustomerID,
                    deliveryAddress: location.state.DeliveryAddress, 
                    deliveryDate: location.state.DeliveryDate,
                    orderStatus: location.state.OrderStatus,
                }}
            onSubmit={(values) => {
               updateOrder(values);
            }}

            validationSchema={Yup.object().shape({
                customerID: Yup.string()
                    .required('Required'),
                deliveryAddress: Yup.string()
                    .required('Required')
                    .max(200),
                deliveryDate: Yup.string()
                    .required('Required'),
                orderStatus: Yup.string()
                    .required('Required')
                    .max(30),
            })}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
              } = props;
              return (
                <form onSubmit={handleSubmit} style={{margin: 15}} noValidate>
                    <Typography variant="h6">
                        {title}
                    </Typography>
                    <Divider/>
                    <Button
                        variant="contained" 
                        color="primary"
                        style={{marginLeft: 15, marginTop: 15, textTransform: 'none'}}
                        startIcon={<ArrowBackIcon/>}
                        onClick={() => { history.push('/update-order-products', {...location.state})}}>
                            Back
                    </Button>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            label="Select Customer"
                            name="customerID"
                            select
                            value={values.customerID}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={(errors.customerID && touched.customerID) && errors.customerID}
                            margin="normal"
                            fullWidth
                            >
                                {customers.map((option, index) => (
                                    <MenuItem key={index} value={option.CustomerID}>
                                        {option.CustomerName}
                                    </MenuItem>
                                    ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Delivery Address"
                            name="deliveryAddress"
                            multiline
                            rows="4"
                            value={values.deliveryAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={(errors.deliveryAddress && touched.deliveryAddress) && errors.deliveryAddress}
                            margin="normal"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Field
                            type="text"
                            label="Delivery Date"
                            name="deliveryDate"
                            value={values.deliveryDate}
                            component={DatePicker}
                            format="dd MMMM yyyy"
                            fullWidth
                            />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Order Status"
                            name="orderStatus"
                            select
                            value={values.orderStatus}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={(errors.orderStatus && touched.orderStatus) && errors.orderStatus}
                            margin="normal"
                            fullWidth
                            >
                                {orderStatusOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                    ))}
                        </TextField>
                    </Grid>
                  </Grid>
                    <br></br>
                    <Button type="submit" variant="contained" color="primary" style={{marginLeft: 15,textTransform: 'none'}}>
                      Submit
                    </Button>
                    <br></br>
                    <br></br>
                </form>
              );
            }}
            </Formik>
            <MessageDialog confirmMessage={confirmMessage} open={openMessage} onClose={handleMessageClose}  description={messageDescription} />
            <Loading open={putLoading} />
            </Paper>
          </Grid>
         </Grid>
        )}}
    </Subscribe>
 </Transition>
)
} 

export default UpdateOrderCustomer
