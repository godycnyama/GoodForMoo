import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import _ProductsContainer from './ProductsContainer';
import PageAnimation from '../shared/PageAnimation';
import Transition from '../shared/Transition';
import { Subscribe } from 'unstated';
import { Table, TableHead, TableBody,TableRow, TableCell, IconButton, TablePagination, Tooltip } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {
    Formik, Form, Field, ErrorMessage,
  } from 'formik';
import * as Yup from 'yup';
//import { TextField, Select } from 'formik-material-ui';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import Button from '@material-ui/core/Button';
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
import { openToast } from '../utils/utility';
import useAxios from 'axios-hooks';

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
    'ProductID',
    'ProductName'
]

const orderByOptions = [
    'ProductID asc',
    'ProductID desc',
    'ProductName asc',
    'ProductName desc'
]

const Products = () => {
    const [anchorEl0, setAnchorEl0] = useState(null);
    const [searchBy, setSearchBy] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);
    const [orderBy, setOrderBy] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [pageTotal, setPageTotal] = useState(0);
    const [currentProduct, setCurrentProduct] = useState({});
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmConfirmDialog, setConfirmConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = React.useState("");
    const [confirmDialogDescription, setConfirmDialogDescription] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
  
    //const BASE_URL = `${window.location.protocol}//${window.location.host}` ;

    const classes = useStyles();
    const history = useHistory();
    let nextPage = "";
    let currentPageProducts = [];
    let previousPageProducts = [];
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

    const getProducts = () => {
     let searchAllUrl = `/api/products?$orderBy=${orderBy}&$top=${perPage}`;
     let searchByUrlWithIntSearchTerm = `/api/products?$filter=${searchBy} eq ${searchTerm}&$orderBy=${orderBy}&$top=${perPage}`;
     let searchByUrlWithTextSearchTerm = `/api/products?$filter=${searchBy} eq '${searchTerm}'&$orderBy=${orderBy}&$top=${perPage}`;
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

    const deleteProduct = () => {
      executeDelete({
        method: 'delete',
        url: BASE_URL + `/api/products(${currentProduct.ProductID})`
        })
    }
    const openConfirmDialogDialog = () => {
      setOpenConfirmDialog(true);
    };

    const handleConfirmDialogClose = value => {
      setOpenConfirmDialog(false);
      setConfirmConfirmDialog(value);
      if(value) {
          deleteProduct(currentProduct);
      }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        getProducts()
    }

    const handleChangeRowsPerPage = event => {
        setPerPage(parseInt(event.target.value), 10);
        setCurrentPage(0);
        getProducts()
    }

    const addProduct = () => {
        history.push('/create-product');
    }

    const handleActionsMenuClick = event => {
        setAnchorEl0(event.currentTarget);
    }
  
    const handleActionsMenuClose = () => {
        setAnchorEl0(null);
    }

    const handleDeleteProduct = (_product) => {
      setCurrentProduct(_product);
      setConfirmDialogTitle('Delete Product');
      setConfirmDialogDescription(`Are you sure you want to delete product with ID: ${_product.ProductID}`);
      openConfirmDialogDialog();
  }

  const handleMessageClose = value => {
    setOpenMessage(false);
    setConfirmMessage(value);
  };

  if(getData){
    console.log(getData)
    currentPageProducts = [...getData.value];
    console.log(currentPageProducts);
  }

  if( getError ) {
    console.log(getError.response);
    openToast("error", getError.response.data.message );
  } 

  if( deleteError ) {
    console.log(deleteError.response);
    openToast("error", deleteError.response.data.message );
  } 

  if( deleteData ) {
    openToast("success", deleteData.message );
  } 

  
  
  return (
      <Transition>
          <Subscribe to = {[_ProductsContainer]}>
            {(productsStore) => {
                const { state: {_products, _currentPage, _perPage, _pageTotal, _searchBy, _searchTerm, _orderBy, _navigation }, 
                setSelectedProduct, 
                _setProducts, 
                _setCurrentPage,
                _setPageTotal, 
                _setPerPage,
                _setSearchBy,
                _setSearchTerm,
                _setOrderBy,
                _setNavigation } = productsStore;

                console.log(productsStore.state);
                if(_navigation)
                {
                  currentPageProducts = [..._products];
                  _setNavigation(false);
                }

                //setProducts(currentPageProducts);
                setCurrentPage(_currentPage);
                setPerPage(_perPage);
                setPageTotal(_pageTotal);
                setOrderBy(_orderBy);

                const handleViewProduct = (product) => {
                  _setProducts(currentPageProducts);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  setSelectedProduct(product);
                  _setNavigation(true);
                  history.push('/view-product', {...product});
                }
          
                const handleEditProduct = (product) => {
                  _setProducts(currentPageProducts);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  setSelectedProduct(product);
                  _setNavigation(true);
                  history.push('/update-product', {...product});
                }

                return (
                  <Grid container>
                    <Grid item xs={8}>
                      <Paper>
                        <Typography variant="h6" style={{margin: 15}} >
                            Products
                        </Typography>
                        <Divider style={{margin: 15}}/>
                        <Button
                            variant="contained" 
                            color="primary"
                            style={{marginLeft: 15, textTransform: 'none'}}
                            startIcon={<AddIcon/>}
                            onClick={() => { addProduct()}}>
                              Add Product
                        </Button>
                        <Formik
                          initialValues={{
                            searchBy: _searchBy,
                            searchTerm: _searchTerm,
                            orderBy: _orderBy
                          }}

                          validationSchema={Yup.object().shape({
                            searchBy: Yup.string()
                              .required('Required'),
                            searchTerm: Yup.string(),
                            orderBy: Yup.string()
                              .required('Required'),
                          })}

                          onSubmit={(values) => {
                            console.log('Search for products');
                            setSearchBy(values.searchBy);
                            setSearchTerm(values.searchTerm);
                            setOrderBy(values.orderBy);
                            getProducts();
                          }}
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
                          );
                        }}
                      </Formik>
                        <br></br>
                        {products.length !== 0 &&(
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={products.length}
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
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Unit of Measure</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>      
                            </TableHead>
                            <TableBody>
                            {currentPageProducts.map((row, index) => (
                              <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {row.ProductID}
                                  </TableCell>
                                  <TableCell>
                                    {row.ProductName}
                                  </TableCell>
                                  <TableCell>
                                    <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={row.UnitPrice} displayType={'text'} prefix={row.Currency} />
                                  </TableCell>
                                  <TableCell>
                                    {row.UnitOfMeasure}
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip title="View product">
                                      <IconButton aria-label="view" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={() => {handleViewProduct(row)}}>
                                        <LaunchIcon/>
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Update product">
                                      <IconButton aria-label="update" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={() => {handleEditProduct(row)}}>
                                        <EditIcon/>
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete product">
                                      <IconButton aria-label="delete" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={() => {setCurrentProduct(row);handleDeleteProduct(row)}}>
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


export default Products
