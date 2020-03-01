import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { Subscribe } from 'unstated';
import _ProductsContainer  from './ProductsContainer';
import NumberFormat from 'react-number-format';
import Transition  from '../shared/Transition';
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

const UpdateProduct = () => {
    const [currentProduct, setCurrentProduct] = useState({});
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [openLoading, setOpenLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;

    const [{data: putData, loading: putLoading, error: putError}, executePut] = useAxios({
        url: BASE_URL,
        method: "PUT"
    },{
        manual: true
    });
    
    const updateProduct = (productData) => {
        executePut({
            method: 'put',
            url: BASE_URL + "/api/products/" + currentProduct.ProductID ,
            data: {
                productID: currentProduct.ProductID,
                productDTO: productData
            }});
    }
    /*
    const openMessageDialog = () => {
        setMessageDescription("Product created successfully!");
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
    <Subscribe to = {[_ProductsContainer]}>
      {productsStore => {
        const { state: { selectedProduct }} = productsStore;

        return (
         <Grid container>
          <Grid item xs={12} lg={6}>
            <Paper>
              <Formik
                  initialValues={{ 
                    productName: selectedProduct.productName,
                    unitPrice: selectedProduct.unitPrice, 
                    currency: selectedProduct.currency,
                    unitOfMeasure: selectedProduct.unitOfMeasure
                    }}
                  onSubmit={(values, { setSubmitting }) => {
                     //setSubmitting(true);
                     updateProduct(values);
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
                            Update Product
                        </Typography>
                        <Divider/>
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
                <Loading open={putLoading} />
            </Paper>
          </Grid>
         </Grid>
        )}}
    </Subscribe>
 </Transition>
)
} 

export default UpdateProduct
