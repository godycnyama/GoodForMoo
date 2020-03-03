import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { Formik,Field } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import NumberFormat from 'react-number-format';
import { DatePicker } from 'material-ui-formik-components/DatePicker';
import { Subscribe } from 'unstated';
import _OrdersContainer from './OrdersContainer';
import Transition from '../shared/Transition';
import { BASE_URL } from '../shared/Constants';
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

const UpdateOrder = () => {
    const [currentOrder, setCurrentOrder] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [openLoading, setOpenLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [{data: putData, loading: putLoading, error: putError}, executePut] = useAxios({
        url: BASE_URL,
        method: "PUT"
    },{
        manual: true
    });

    const updateOrder = (orderData) => {
        executePut({
            method: 'put',
            url: BASE_URL + '/api/orders',
            data: {
              ...orderData,
              orderID: currentOrder.orderID
            }})
    }
  /*
  const openMessageDialog = () => {
      setMessageDescription("Order updated successfully!");
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
      openToast("error", putError.message );
  }

  if(putData) {
      openToast("success", putData.message );
  }
  
return (
  <Transition>
    <Subscribe to = {[_OrdersContainer]}>
      {ordersStore => {
        const { state: { _selectedOrder }} = ordersStore;
        console.log(_selectedOrder)
        setCurrentOrder(_selectedOrder);

        return (
         <Grid container>
          <Grid item xs={12} lg={6}>
            <Paper>
              <Formik
                  initialValues={{ 
                    product: _selectedOrder.OrderDetails[0].Product.ProductName,
                    quantity: _selectedOrder.OrderDetails[0].Quantity, 
                    customer: _selectedOrder.CustomerName,
                    deliveryAddress: _selectedOrder.DeliveryAddress, 
                    deliveryDate: _selectedOrder.DeliveryDate,
                    }}
                  onSubmit={(values, { setSubmitting }) => {
                     //setSubmitting(true);
                     updateOrder(values);
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
                            Update Order
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
                                    type="text"
                                    label="Delivery Date"
                                    name="deliveryDate"
                                    component={DatePicker}
                                    format="dd MMMM yyyy"
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
                <Loading open={putLoading} />
            </Paper>
          </Grid>
         </Grid>
        )}}
    </Subscribe>
 </Transition>
)
} 

export default UpdateOrder
