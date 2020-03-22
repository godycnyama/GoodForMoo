import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Transition from '../shared/Transition';
import { BASE_URL } from '../shared/Constants';
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
    //const BASE_URL = `${window.location.protocol}//${window.location.host}`

    const history = useHistory();

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
            },
            headers: {'Content-Type':'application/json' }
        })
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
        console.log(postError.response);
        openToast("error", postError.response.data.message);
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
                    physicalAddress: '', 
                    town: '', 
                    postalCode: '',
                    province: '', 
                    email:'',
                    telephone:'',
                    mobile: ''
                    }}
                onSubmit={(values, { setSubmitting }) => {
                   console.log("Submit customer called");
                   addCustomer(values);
                }}

                validationSchema={Yup.object().shape({
                    customerName: Yup.string()
                        .required('Required')
                        .max(50),
                    physicalAddress: Yup.string()
                        .required('Required')
                        .max(200),
                    town: Yup.string()
                        .required('Required')
                        .max(50),
                    postalCode: Yup.string()
                        .required('Required')
                        .max(20),
                    province: Yup.string()
                        .required('Required')
                        .max(50),
                    email: Yup.string()
                        .max(50),
                    telephone: Yup.string()
                        .max(50),
                    mobile: Yup.string()
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
                         Add Customer
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
                                name="physicalAddress"
                                multiline
                                rows="4"
                                value={values.physicalAddress}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.physicalAddress && touched.physicalAddress) && errors.physicalAddress}
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
