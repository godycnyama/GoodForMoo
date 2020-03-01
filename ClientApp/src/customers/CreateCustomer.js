import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Transition from '../shared/Transition';
//import { BASE_URL } from '../shared/Constants';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';
import useAxios from 'axios-hooks';


const CreateCustomer = () => {
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

    const addCustomer = (customerData) => {
        executePost({
            method: 'post',
            url: BASE_URL + '/api/customers',
            data: {
              ...customerData
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
                    customerName: '',
                    address: '', 
                    town: '', 
                    postalCode: '',
                    province: '', 
                    email:'',
                    telephone:'',
                    mobile: ''
                    }}
                onSubmit={(values, { setSubmitting }) => {
                   //setSubmitting(true);
                   addCustomer(values);
                }}

                validationSchema={Yup.object().shape({
                    customerName: Yup.string()
                        .required('Required'),
                    address: Yup.string()
                        .required('Required'),
                    town: Yup.string()
                        .required('Required'),
                    postalCode: Yup.string()
                        .required('Required'),
                    province: Yup.string()
                        .required('Required'),
                    email: Yup.string()
                        .required('Required'),
                    telephone: Yup.number()
                        .required('Required'),
                    mobile: Yup.string()
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
                         Add Customer
                      </Typography>
                      <Divider/>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Customer Name"
                                name="customerName"
                                value={values.customerName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.customerName && touched.customerName) && errors.customerName}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Delivery Address"
                                name="address"
                                multiline
                                rows="4"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.address && touched.address) && errors.address}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="City/Town"
                                name="town"
                                value={values.town}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.town && touched.town) && errors.town}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Postal Code"
                                name="postalCode"
                                value={values.postalCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.postalCode && touched.postalCode) && errors.postalCode}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Province"
                                name="province"
                                value={values.province}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.province && touched.province) && errors.province}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Telephone"
                                name="telephone"
                                value={values.telephone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.telephone && touched.telephone) && errors.telephone}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Mobile"
                                name="mobile"
                                value={values.mobile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.mobile && touched.mobile) && errors.mobile}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.email && touched.email) && errors.email}
                                margin="normal"
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

export default CreateCustomer
