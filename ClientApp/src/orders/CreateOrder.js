import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { DatePicker } from 'formik-material-ui-pickers';
import axios from 'axios';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
//import { TextField, Select } from 'formik-material-ui';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import NumberFormat from 'react-number-format';
import MaskedInput from 'react-text-mask';
//import { DatePicker, DateTimePicker } from 'material-ui-formik-components/DatePicker';
import Transition from '../shared/Transition';
//import { BASE_URL } from '../shared/Constants';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';
import useAxios from 'axios-hooks';

const currencyOptions = [
    'R',
    'USD',
    'BP',
    'Pula',
  ]

const unitOfMeasureOptions = [
    'Sq.m',
    'Sq.f',
    'Sq.in',
    'KG',
    'L',
    'M',
  ]

const productOptions = [
    {
      productID: 0,
      productName: "Lawn Block",
      unitPrice: "250",
      currency: "R",
      unitOfMeasure: "Sq.m",
    },
    {
      productID: 1,
      productName: "Lawn Block",
      unitPrice: "250",
      currency: "R",
      unitOfMeasure: "Sq.m",
    }
]

const customerOptions = [
    {
      customerID: 0,
      customerName: "Wayne Stewart",
      address: "25 Betway Road",
      town: "Ballito",
      postalCode: "4420",
      telephone: "032 946 6892",
      mobile: "0786018623",
      email:"godycnyama@gmail.com"
    },
    {
      customerID: 1,
      customerName: "Wayne Stewart",
      address: "25 Betway Road",
      town: "Ballito",
      postalCode: "4420",
      telephone: "032 946 6892",
      mobile: "0786018623",
      email:"godycnyama@gmail.com"
    }
  ]

const CreateOrder = () => {
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [openLoading, setOpenLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const BASE_URL = `${window.location.protocol}//${window.location.host}`

    const [{data: postData, loading: postLoading, error: postError}, executePost] = useAxios({
        url: BASE_URL,
        method: "POST"
    },{
        manual: true
    });

    const addOrder = (orderData) => {
        executePost({
            method: 'get',
            url: BASE_URL + '/api/orders',
            data: {
              ...orderData
            }})
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
      openToast("error", postError.message );
  }

  if(postData) {
      openToast("success", postData.message );
  }

return (
  <Transition>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Paper>
            <Formik
                initialValues={{ 
                    product: '',
                    quantity: '', 
                    customer: '',
                    deliveryAddress: '', 
                    deliveryDate: '',
                    }}
                onSubmit={(values, { setSubmitting }) => {
                   //setSubmitting(true);
                   addOrder(values);
                }}

                validationSchema={Yup.object().shape({
                    product: Yup.string()
                        .required('Required')
                        .max(150),
                    quantity: Yup.string()
                        .required('Required'),
                    customer: Yup.string()
                        .required('Required')
                        .max(50),
                    deliveryAddress: Yup.string()
                        .required('Required')
                        .max(200),
                    deliveryDate: Yup.string()
                        .required('Required')
                        .max(50)
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
                         Add Order
                      </Typography>
                      <Divider/>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                    {productOptions.map(option => (
                                        <MenuItem key={option.productID} value={option.productID}>
                                            {option.productName}
                                        </MenuItem>
                                        ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <TextField
                                label="Select Customer"
                                name="customer"
                                select
                                value={values.customer}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.customer && touched.customer) && errors.customer}
                                margin="normal"
                                fullWidth
                                >
                                    {customerOptions.map(option => (
                                        <MenuItem key={option.customerID} value={option.customerID}>
                                            {option.customerName}
                                        </MenuItem>
                                        ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <Field 
                              component={DatePicker} 
                              name="deliveryDate" 
                              label="Delivery Date"
                              format="dd/mm/yyyy"
                              value={values.deliveryDate} 
                              fullWidth
                              />
                        </Grid>
                      </Grid>
                        <br></br>
                        <Button type="submit" variant="contained" color="primary" style={{marginRight: 15,textTransform: 'none'}}>
                          Submit
                        </Button>
                        <br></br>
                        <br></br>
                    </form>
                  );
                }}
              </Formik>
              <MessageDialog confirmMessage={confirmMessage} open={openMessage} onClose={handleMessageClose}  description={messageDescription} />
              <Loading open={postLoading} />
          </Paper>
        </Grid>
    </Grid>
</Transition>
)} 

export default CreateOrder
