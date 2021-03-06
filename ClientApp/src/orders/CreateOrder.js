﻿import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { Table, TableHead, TableBody,TableRow, TableCell, IconButton, TablePagination, Tooltip } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
//import { DatePicker } from 'formik-material-ui-pickers';
import { FormikDatePicker } from '@dccs/react-formik-mui';
import axios from 'axios';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
//import { TextField, Select } from 'formik-material-ui';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import LaunchIcon from '@material-ui/icons/Launch';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import NumberFormat from 'react-number-format';
import MaskedInput from 'react-text-mask';
import { DatePicker } from 'material-ui-formik-components/DatePicker';
import Transition from '../shared/Transition';
import { BASE_URL } from '../shared/Constants';
import _OrdersContainer from './OrdersContainer';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';
import useAxios from 'axios-hooks';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

const useStyles = makeStyles({
  root: {
      width: '100%',
      overflowX: 'auto',
  },
  table: {
      minWidth: 650,
  }
})

const currencyOptions = [
    'R'
  ]

const orderStatusOptions = [
    'Pending',
    'Complete'
  ]

const unitOfMeasureOptions = [
  'Sq m',
  'Sq f',
  'Sq in',
  'KG',
  'L',
  'M',
  'Each',
  'Pack',
  'Box',
  'Case'
  ]

const CreateOrder = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [openLoading, setOpenLoading] = useState(false);
    //const [products, setProducts] = useState([]);
    //const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([]);
    const [order, setOrder] = useState([]); //order from database
    const [confirmLoading, setConfirmLoading] = useState(false);
    //const BASE_URL = `${window.location.protocol}//${window.location.host}`;

    let products = [];
    let customers = [];
    const history = useHistory();
    const classes = useStyles();

    const handleNext = () => {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };

    const [{data: getProductsData, loading: getProductsLoading, error: getProductsError }, executeProductsGet] = useAxios({
      url: BASE_URL,
      method: "GET"
    },{
        manual: true
    });

    const [{data: getCustomersData, loading: getCustomersLoading, error: getCustomersError }, executeCustomersGet] = useAxios({
      url: BASE_URL,
      method: "GET"
    },{
        manual: true
    });

    const getProducts = () => {
      executeProductsGet({
        method: 'get',
        url: BASE_URL + '/api/products',
       })
    }

    const getCustomers = () => {
      executeCustomersGet({
        method: 'get',
        url: BASE_URL + '/api/customers',
       })
    }

    useEffect(() => {
      getProducts();
      getCustomers();
    },[]);

    const [{data: postData, loading: postLoading, error: postError }, executePost] = useAxios({
        url: BASE_URL,
        method: "POST"
    },{
        manual: true
    });

    const addOrder = (orderData) => {
        executePost({
            method: 'post',
            url: BASE_URL + '/api/orders',
            data: {
              ...orderData,
              orderDetails: [...cart]
            }})
    }

    const addToCart = (product) => {
      //check if product already in cart
      for(let i=0; i < cart.length; i++){
        if(cart[i].ProductID === product.product){
         openToast("success", "Product already added to order" );
         return
        }
      }
      
      for(let i=0; i < products.length; i++){
        if(products[i].ProductID === product.product){
          let _product = {
            ...products[i],
            Quantity: product.quantity
          };
         
          let list = [...cart];
          list.push(_product);
          setCart(list);
        }
      }
    }

    const removeFromCart = (product) => {
      let list = [...cart];
      for(let i=0; i < list.length; i++){
        if(list[i].productID === product.productID){
          list.splice(i,1);
          setCart(list);
          return
        }
      }
    }

  /*
  const openMessageDialog = () => {
      setMessageDescription("Order created successfully!");
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
  

  if(postError) {
      console.log(postError.response);
      openToast("error", postError.response.data.message );
  }

  if(postData) {
    console.log(postData);
    openToast("success", postData.message );
    history.push('/order-success', {...postData.order});
  }

  if(getProductsError) {
    openToast("error", getProductsError.response.data.message );
  }

  if(getCustomersError) {
    openToast("error", getCustomersError.response.data.message );
  }

  if(getProductsData) {
    products = [...getProductsData.value];
  }

  if(getCustomersData) {
    customers = [...getCustomersData.value];
  }

return (
  <Transition>
      <Grid container>
        <Grid item xs={12} lg={8}>
          <Paper>
            <Typography variant="h6" style={{margin: 15}} >
               Create Order
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
            <br></br>
            <Stepper activeStep={activeStep} alternativeLabel orientation="horizontal">
              <Step>
                <StepLabel>Add Products</StepLabel>
              </Step>
              <Step>
                <StepLabel>Add Customer Details</StepLabel>
              </Step>
            </Stepper>
            {activeStep === 0 && (<div>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit of Measure</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>      
                </TableHead>
                <TableBody>
                {cart.map((row, index) => (
                  <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.ProductName}
                      </TableCell>
                      <TableCell>
                        <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={row.UnitPrice} displayType={'text'} prefix={row.Currency} />
                      </TableCell>
                      <TableCell>
                        {row.Quantity}
                      </TableCell>
                      <TableCell>
                        {row.UnitOfMeasure}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Remove">
                          <IconButton aria-label="remove" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={() => {
                          removeFromCart(row);
                          }}>
                            <DeleteIcon/>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
              <br/>
            </Paper>
            <br/>
            <Formik
              initialValues={{ 
                  product: '',
                  quantity: '', 
                  }}
              onSubmit={(values) => {
                console.log("Add To Cart called")
                addToCart(values);
              }}

              validationSchema={Yup.object().shape({
                  product: Yup.string()
                      .required('Required'),
                  quantity: Yup.string()
                      .required('Required'),
                  
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                          <TextField
                              label="Select Product"
                              name="product"
                              select
                              value={values.product}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={(errors.product && touched.product) && errors.product}
                              margin="normal"
                              fullWidth
                              >
                                  {products.map((option, index) => (
                                      <MenuItem key={index} value={option.ProductID}>
                                          {option.ProductName} {option.UnitOfMeasure}
                                      </MenuItem>
                                      ))}
                          </TextField>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                          <NumberFormat
                              label="Quantity"
                              name="quantity"
                              customInput={TextField}
                              thousandSeparator={true}
                              decimalSeparator={'.'}
                              decimalScale={0}
                              value={values.quantity}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={(errors.quantity && touched.quantity) && errors.quantity}
                              margin="normal"
                              fullWidth
                              />
                      </Grid>
                      <Grid item xs={2}>
                          <Button
                            type="submit"
                            variant="contained" 
                            color="primary"
                            style={{ marginTop: 25,textTransform: 'none'}}
                            startIcon={<AddIcon/>}
                            >
                              Add
                          </Button>
                      </Grid>
                    </Grid>
                      <br></br>
                      <Button variant="contained" color="primary" disabled={cart.length === 0} style={{marginRight: 15,textTransform: 'none'}} onClick={() => {handleNext()}}>
                        Next
                      </Button>
                      <br></br>
                      <br></br>
                  </form>
                );
              }}
            </Formik></div>)}
            {activeStep === 1 && (<Formik
              initialValues={{ 
                  customerID: '',
                  deliveryAddress: '', 
                  deliveryDate: null,
                  orderStatus: '',
                  }}
              onSubmit={(values, { setSubmitting }) => {
                console.log('Submission Called')
                 addOrder(values);
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
                      .max(50),
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
                      <Button variant="contained" color="primary" style={{marginRight: 15,textTransform: 'none'}} onClick={() => {handleBack()}}>
                        Back
                      </Button>
                      <Button type="submit" variant="contained" color="primary" style={{textTransform: 'none'}}>
                        Submit
                      </Button>
                      <br></br>
                      <br></br>
                  </form>
                );
              }}
            </Formik>)}
            <MessageDialog confirmMessage={confirmMessage} open={openMessage} onClose={handleMessageClose}  description={messageDescription} />
            <Loading open={postLoading || getProductsLoading || getCustomersLoading} />
          </Paper>
        </Grid>
    </Grid>
</Transition>
)} 

export default CreateOrder
