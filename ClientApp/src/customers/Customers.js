import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import _CustomersContainer from './CustomersContainer';
import PageAnimation from '../shared/PageAnimation';
import Transition from '../shared/Transition';
import { Subscribe } from 'unstated';
import { Table, TableHead, TableBody,TableRow, TableCell, IconButton, TablePagination, Tooltip } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {
    Formik, Form, Field,
  } from 'formik';
import * as Yup from 'yup';
//import { TextField } from 'formik-material-ui';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LaunchIcon from '@material-ui/icons/Launch';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { BASE_URL } from '../shared/Constants';
import ConfirmDialog from '../shared/ConfirmDialog';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import useAxios from 'axios-hooks';
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



const searchByOptions = [
    'All',
    'CustomerID',
    'CustomerName'
]

const orderByOptions = [
  'CustomerID asc',
  'CustomerID desc',
  'CustomerName asc',
  'CustomerName desc'
]

const Customers = () => {
    const [anchorEl0, setAnchorEl0] = useState(null);
    const [searchBy, setSearchBy] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [orderBy, setOrderBy] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [pageTotal, setPageTotal] = useState(0);
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmConfirmDialog, setConfirmConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = React.useState("");
    const [confirmDialogDescription, setConfirmDialogDescription] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    //const BASE_URL = `${window.location.protocol}//${window.location.host}`

    const classes = useStyles();
    const history = useHistory();

    let nextPage = "";
    let currentPageCustomers = [];
    let previousPageCustomers = [];
    let navigation = false;

    const [{data: getData, loading: getLoading, error: getError}, executeGet] = useAxios({
      url: BASE_URL,
      method: "GET"
    },{
        manual: true
    });

    const [{data: deleteData, loading: deleteLoading, error: deleteError}, executeDelete] = useAxios({
      url: BASE_URL,
      method: "DELETE"
    },{
    manual: true
    });

    const getCustomers = () => {
      let searchAllUrl = `/api/customers?$orderBy=${orderBy}&$top=${perPage}`;
      let searchByUrlWithIntSearchTerm = `/api/customers?$filter=${searchBy} eq ${searchTerm}&$orderBy=${orderBy}&$top=${perPage}`;
      let searchByUrlWithTextSearchTerm = `/api/customers?$filter=${searchBy} eq '${searchTerm}'&$orderBy=${orderBy}&$top=${perPage}`;
      let odataUrl = "";
      
      if(searchBy === "All"){
        odataUrl = searchAllUrl;
      } 
      
      if (searchBy !== "All" && isNaN(searchTerm)){
        odataUrl = searchByUrlWithTextSearchTerm;
      }

      if (searchBy !== "All" && !isNaN(searchTerm)){
        odataUrl = searchByUrlWithIntSearchTerm; 
      }

      executeGet({
        method: 'get',
        url: BASE_URL + odataUrl,
        })
    }

    const deleteCustomer = (_customer) => {
      executeDelete({
        method: 'delete',
        url: BASE_URL + `/api/customers(${_customer.CustomerID})`,
        })
    }
    const openConfirmDialogDialog = () => {
      setOpenConfirmDialog(true);
    };

    const handleConfirmDialogClose = value => {
      setOpenConfirmDialog(false);
      setConfirmConfirmDialog(value);
      if(value) {
          deleteCustomer(currentCustomer);
      }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        getCustomers()
    }

    const handleChangeRowsPerPage = event => {
        setPerPage(parseInt(event.target.value), 10);
        setCurrentPage(0);
        getCustomers()
    }

    const addCustomer = () => {
        history.push('/create-customer');
    }

    const handleActionsMenuClick = event => {
        setAnchorEl0(event.currentTarget);
    }
  
    const handleActionsMenuClose = () => {
        setAnchorEl0(null);
    }

    const handleDeleteCustomer = (_current) => {
        setCurrentCustomer(_current);
        setConfirmDialogTitle('Delete Customer');
        setConfirmDialogDescription(`Are you sure you want to delete customer with ID: ${_current.CustomerID}`);
        openConfirmDialogDialog();
    }

    const handleMessageClose = value => {
      setOpenMessage(false);
      setConfirmMessage(value);
  };

  
    if(getData){
      currentPageCustomers = [...getData.value];
    }

    //if get error show alert
    if( getError ) {
      openToast("error", getError.response.data.message );
    } 

    //if delete error show alert
    if( deleteError ) {
      openToast("error", deleteError.response.data.message );
    } 

    //if delete success show alert
    if( deleteData ) {
      openToast("success", deleteData.message );
    } 

  
  return (
      <Transition>
          <Subscribe to = {[_CustomersContainer]}>
            {(customersStore) => {
                const { state: {_customers, _currentPage, _perPage, _pageTotal, _searchBy, _searchTerm, _orderBy, _navigation }, 
                setSelectedCustomer, 
                _setCustomers, 
                _setCurrentPage,
                _setPageTotal, 
                _setPerPage,
                _setSearchBy,
                _setSearchTerm,
                _setOrderBy,
                _setNavigation } = customersStore;
                
                console.log()
                console.log(customersStore.state);
                if(_navigation)
                {
                  currentPageCustomers = [..._customers];
                  _setNavigation(false);
                }
                setCurrentPage(_currentPage);
                setPerPage(_perPage);
                setPageTotal(_pageTotal);
                setOrderBy(_orderBy);

                const handleViewCustomer = (customer) => {
                  _setCustomers(currentPageCustomers);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  setSelectedCustomer(customer);
                  _setNavigation(true);
                  history.push('/view-customer', {...customer});
                }
          
                const handleEditCustomer = (customer) => {
                  _setCustomers(currentPageCustomers);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  setSelectedCustomer(customer);
                  _setNavigation(true);
                  history.push('/update-customer', {...customer});
                }
          
                

                return (
                  <Grid container>
                    <Grid item xs={12}>
                      <Paper>
                        <Typography variant="h6" style={{margin: 15}} >
                            Customers
                        </Typography>
                        <Divider style={{margin: 15}}/>
                        <Button
                            variant="contained" 
                            color="primary"
                            style={{marginLeft: 15, textTransform: 'none'}}
                            startIcon={<AddIcon/>}
                            onClick={() => { addCustomer()}}>
                              Add Customer
                        </Button>
                        <Formik
                            initialValues={{
                            searchBy: _searchBy,
                            searchTerm: _searchTerm,
                            orderBy: _orderBy,
                            currentPage: _currentPage,
                            perPage: _perPage
                          }}

                          validationSchema={Yup.object().shape({
                            searchBy: Yup.string()
                              .required('Required'),
                            searchTerm: Yup.string(),
                            orderBy: Yup.string()
                              .required('Required'),
                          })}

                          onSubmit={(values) => {
                            setSearchBy(values.searchBy);
                            setSearchTerm(values.searchTerm);
                            setOrderBy(values.orderBy);
                            getCustomers();
                          }}>
                            {({values,
                              touched,
                              errors,
                              dirty,
                              isSubmitting,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              handleReset}) => (
                              <form onSubmit={handleSubmit} style={{margin: 15}} noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                      <TextField
                                          label="Search By"
                                          name="searchBy"
                                          select
                                          value={values.searchBy}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          helperText={(errors.searchBy && touched.searchBy) && errors.searchBy}
                                          margin="normal"
                                          fullWidth
                                        >
                                        {searchByOptions.map((option, index) => (
                                          <MenuItem key={index} value={option}>
                                              {option}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </Grid>
                                    {values.searchBy !== "All" && (
                                        <Grid item xs={4}>
                                          <TextField
                                            label="Search Term"
                                            name="searchTerm"
                                            value={values.searchTerm}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.searchTerm && touched.searchTerm) && errors.searchTerm}
                                            margin="normal"
                                            fullWidth
                                          />
                                        </Grid>
                                    )}
                                    <Grid item xs={4}>
                                      <TextField
                                          label="Order By"
                                          name="orderBy"
                                          select
                                          value={values.orderBy}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          helperText={(errors.orderBy && touched.orderBy) && errors.orderBy}
                                          margin="normal"
                                          fullWidth
                                        >
                                        {orderByOptions.map((option, index) => (
                                          <MenuItem key={index} value={option}>
                                              {option}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            type="submit"
                                            variant="contained" 
                                            color="primary"
                                            style={{textTransform: 'none'}}
                                            startIcon={<SearchIcon/>}
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                          )}
                        </Formik>
                        <br></br>
                        {customers.length !== 0 && (
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={customers.length}
                            rowsPerPage={perPage}
                            page={currentPage}
                            backIconButtonProps={{
                              'aria-label': 'previous page'
                            }}
                            nextIconButtonProps={{
                              'aria-label': 'next page'
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                          />
                        )}
                        
                        <Paper className={classes.root}>
                          <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>CustomerID</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Telephone</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>      
                            </TableHead>
                            <TableBody>
                            {currentPageCustomers.map((row, index) => (
                              <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {row.CustomerID}
                                  </TableCell>
                                  <TableCell>
                                    {row.CustomerName}
                                  </TableCell>
                                  <TableCell>
                                    <p>{row.PhysicalAddress}</p>
                                    <p>{row.Town}</p>
                                    <p>{row.PostalCode}</p>
                                    <p>{row.Province}</p>
                                  </TableCell>
                                  <TableCell>
                                    {row.Telephone}
                                  </TableCell>
                                  <TableCell>
                                    {row.Mobile}
                                  </TableCell>
                                  <TableCell>
                                    {row.Email}
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip title="View customer">
                                      <IconButton aria-label="view" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={() => {handleViewCustomer(row)}}>
                                        <LaunchIcon/>
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Update customer">
                                      <IconButton aria-label="update" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={() => {handleEditCustomer(row)}}>
                                        <EditIcon/>
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete customer">
                                      <IconButton aria-label="delete" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={() => {setCurrentCustomer(row);handleDeleteCustomer(row)}}>
                                        <DeleteIcon/>
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                              </TableRow>
                            ))}
                            </TableBody>
                          </Table>
                        </Paper>
                        <ConfirmDialog confirmConfirmDialog={confirmConfirmDialog} open={openConfirmDialog} onClose={handleConfirmDialogClose} title={confirmDialogTitle} description={confirmDialogDescription} />
                        <MessageDialog confirmMessage={confirmMessage} open={openMessage} onClose={handleMessageClose}  description={messageDescription} />
                        <Loading open={getLoading || deleteLoading} />
                      </Paper>
                    </Grid>
                  </Grid>
                )}}
          </Subscribe>
      </Transition>
  )
}


export default Customers
