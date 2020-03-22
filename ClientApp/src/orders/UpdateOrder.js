import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
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
import { Subscribe } from 'unstated';
import _OrdersContainer from './OrdersContainer';
import { BASE_URL } from '../shared/Constants';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';
import useAxios from 'axios-hooks';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { useParams } from 'react-router-dom';


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

const UpdateOrder = () => {
    const location = useLocation();
    const [currentOrder, setCurrentOrder] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [openLoading, setOpenLoading] = useState(false);
    //const [products, setProducts] = useState([]);
    //const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([...location.state.orderDetails]);
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [confirmLoading, setConfirmLoading] = useState(false);
    //const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const { id } = useParams();

    let products = [];
    let customers = [];
    let orderDetails = [];
    //let cart = [];
    const history = useHistory();
    //const location = useLocation();
    const classes = useStyles();

    let items = [];
    for(let i=0; i < location.state.orderDetails.length; i++){
      //const { OrderID, OrderDetailID, ..._item } = item;
      let _item = {
        ProductID: location.state.orderDetails[i].ProductID,
        ProductName: location.state.orderDetails[i].ProductName,
        UnitPrice: location.state.orderDetails[i].UnitPrice,
        Quantity: location.state.orderDetails[i].Quantity,
        UnitOfMeasure: location.state.orderDetails[i].UnitOfMeasure,
        Currency: location.state.orderDetails[i].Currency
      }
      items.push(_item);
    }
    //cart = [...items];
    setCart([...items]);
    console.log(cart);

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

    const [{data: getOrderDetailsData, loading: getOrderDetailsLoading, error: getOrderDetailsError }, executeOrderDetailsGet] = useAxios({
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

    const getOrderDetails = () => {
      executeOrderDetailsGet({
        method: 'get',
        url: BASE_URL + `/api/orderDetails?$filter=OrderID eq ${location.state.OrderID}`,
       })
    }

    useEffect(() => {
      getProducts();
      getCustomers();
    },[]);

    const handleNext = () => {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };

    const [{data: getProductsCustomersData, loading: getProductsCustomersLoading, error: getProductsCustomersError}, executeProductsCustomersGet] = useAxios({
      url: BASE_URL,
      method: "GET"
    },{
        manual: true
    });

    const [{data: putData, loading: putLoading, error: putError}, executePatch] = useAxios({
        url: BASE_URL,
        method: "PATCH"
    },{
        manual: true
    });

    const updateOrder = (orderData) => {
        console.log(cart);
        executePatch({
            method: 'patch',
            url: BASE_URL + `/api/orders(${currentOrder.OrderID})`,
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
            Quantity: parseInt(product.quantity)
          };
         
          let list = [...cart];
          list.push(_product);
          setCart(list);
          //cart = [...list];
          console.log(cart);
        }
      }
    }

    const removeFromCart = (product) => {
      let list = [...cart];
      for(let i=0; i < list.length; i++){
        if(list[i].productID === product.productID){
          list.splice(i,1);
          setCart(list);
          //cart = [...list];
          openToast("success", "Product has been removed from order" );
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
  

  if(putError) {
      console.log(putError.response);
      openToast("error", putError.response.data.message );
  }

  if(putData) {
    openToast("success", putData.message );
    history.push('/order-success', {...putData.order});
  }

  if(getProductsError) {
    console.log(getProductsError.response);
    openToast("error", getProductsError.response.data.message );
  }

  if(getCustomersError) {
    console.log(getCustomersError.response);
    openToast("error", getCustomersError.response.data.message );
  }

  if(getOrderDetailsError) {
    console.log(getOrderDetailsError.response);
    openToast("error", getOrderDetailsError.response.data.message );
  }

  if(getProductsData) {
    products = [...getProductsData.value];
    console.log(products);
  }

  if(getCustomersData) {
    customers = [...getCustomersData.value];
    console.log(customers);
  }

  /*
  if(getOrderDetailsData) {
    console.log(getOrderDetailsData);
    //cart = [...getOrderDetailsData.value];
    let items = [];
    for(let i=0; i < getOrderDetailsData.value.length; i++){
      //const { OrderID, OrderDetailID, ..._item } = item;
      let _item = {
        ProductID: getOrderDetailsData.value[i].ProductID,
        ProductName: getOrderDetailsData.value[i].ProductName,
        UnitPrice: getOrderDetailsData.value[i].UnitPrice,
        Quantity: getOrderDetailsData.value[i].Quantity,
        UnitOfMeasure: getOrderDetailsData.value[i].UnitOfMeasure,
        Currency: getOrderDetailsData.value[i].Currency
      }
      items.push(_item);
    }
    cart = [...items];
    console.log(cart);
    //cart = [...getOrderDetailsData.value];
    /*
    orderDetails = [...getOrderDetailsData.value];
    let details = [];
    for(let item in orderDetails){
      details = [...details,{ProductName: item.ProductName,
        UnitPrice: item.UnitPrice,
        Quantity: item.Quantity,
        UnitOfMeasure: item.UnitOfMeasure
      }]
    }
    setCart([...details]);
    console.log(details);
  }
  */

return (
  <Transition>
    <Subscribe to = {[_OrdersContainer]}>
    {ordersStore => {
      const { state: { _selectedOrder }} = ordersStore;
      console.log(_selectedOrder)
      setCurrentOrder(_selectedOrder);
      let title = `Update Order#: ${_selectedOrder.OrderID}`;
    return (
      <Grid container>
        <Grid item xs={12} lg={8}>
          <Paper>
            <Typography variant="h6" style={{margin: 15}} >
               {title}
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
                                          {option.ProductName}
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
            {activeStep === 1 && (
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
            <Loading open={putLoading || getProductsCustomersLoading || getOrderDetailsLoading} />
          </Paper>
        </Grid>
    </Grid>
    )}}
  </Subscribe>
</Transition>
)} 

export default UpdateOrder
