import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Subscribe } from 'unstated';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button  from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import NumberFormat from 'react-number-format';
import _ProductsContainer from './ProductsContainer';
import Transition  from '../shared/Transition';

const ViewProduct = () => {
  const history = useHistory();
  const location = useLocation();
  
  return  (
    <Transition>
      <Subscribe to = {[_ProductsContainer]}>
      { productsStore => {
        const { state: { selectedProduct }} = productsStore;
        return (
          <Grid container>
            <Grid item xs={12} lg={6}>
              <Paper>
                <div style={{margin: 15}}>
                  <Typography variant="h6" >
                      View Product
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
                  <p><b>Product ID:</b> {location.state.ProductID}</p>
                  <p><b>Product Name:</b> {location.state.ProductName}</p>
                  <p><b>Unit Price:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={location.state.UnitPrice} displayType={'text'} prefix={location.state.Currency} /></p>
                  <p><b>Unit Of Measure:</b> {location.state.UnitOfMeasure}</p>
                </div>
              </Paper>
            </Grid>
          </Grid>
        )}}
      </Subscribe>
    </Transition>
    )
}

export default ViewProduct
