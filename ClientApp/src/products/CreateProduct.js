import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuItem from '@material-ui/core/MenuItem';
import NumberFormat from 'react-number-format';
import Transition from '../shared/Transition';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';
import { BASE_URL } from '../shared/Constants';
import useAxios from 'axios-hooks';

const currencyOptions = [
    'R'
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
const CreateProduct = () => {
  const [openMessage, setOpenMessage] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(false);
  const [messageDescription, setMessageDescription] = useState("");
  const [openLoading, setOpenLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //const BASE_URL = `${window.location.protocol}//${window.location.host}`

  const history = useHistory();

  const [{data: postData, loading: postLoading, error: postError}, executePost] = useAxios({
        url: BASE_URL,
        method: "POST"
    },{
        manual: true
    });

  const addProduct = (productData) => {
        executePost({
            method: 'post',
            url: BASE_URL + '/api/products',
            data: {
              ...productData
            },
            headers: {'Content-Type':'application/json' }
          })
    }

  
  const openMessageDialog = () => {
      setMessageDescription("Product created successfully!");
      setOpenMessage(true);
  };

  const openLoadingDialog = () => {
      setOpenLoading(true);
  };

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
  }

return (
  <Transition>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Paper>
            <Formik
                initialValues={{ 
                    productName: '',
                    unitPrice: '', 
                    currency: 'R',
                    unitOfMeasure: 'Sq m', 
                    }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log('Submit clicked');
                   //setSubmitting(true);
                   addProduct(values);
                }}

                validationSchema={Yup.object().shape({
                    productName: Yup.string()
                        .required('Required')
                        .max(150),
                    unitPrice: Yup.string()
                        .required('Required'),
                    currency: Yup.string()
                        .required('Required')
                        .max(10),
                    unitOfMeasure: Yup.string()
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
                      <Typography variant="h6">
                         Add Product
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
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Product Name"
                                name="productName"
                                value={values.productName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.productName && touched.productName) && errors.productName}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <NumberFormat
                                label="Unit Price"
                                name="unitPrice"
                                customInput={TextField}
                                thousandSeparator={true}
                                decimalSeparator={'.'}
                                decimalScale={2}
                                value={values.unitPrice}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.unitPrice && touched.unitPrice) && errors.unitPrice}
                                margin="normal"
                                fullWidth
                                />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Currency"
                                name="currency"
                                select
                                value={values.currency}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.currency && touched.currency) && errors.currency}
                                margin="normal"
                                fullWidth
                                >
                                    {currencyOptions.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                        ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Unit of Measure"
                                name="unitOfMeasure"
                                select
                                value={values.unitOfMeasure}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.unitOfMeasure && touched.unitOfMeasure) && errors.unitOfMeasure}
                                margin="normal"
                                fullWidth
                                >
                                    {unitOfMeasureOptions.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                        ))}
                            </TextField>
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

export default CreateProduct
