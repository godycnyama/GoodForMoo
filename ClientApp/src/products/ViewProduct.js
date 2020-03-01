import React from 'react';
import { Subscribe } from 'unstated';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import _ProductsContainer from './ProductsContainer';
import Transition  from '../shared/Transition';

const ViewProduct = () => (
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
              <Divider></Divider>
              <br></br>
              <p><b>Product ID:</b> {selectedProduct.productID}</p>
              <p><b>Product Name:</b> {selectedProduct.productName}</p>
              <p><b>Unit Price:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={selectedProduct.unitPrice} displayType={'text'} prefix={selectedProduct.currency} /></p>
              <p><b>Unit Of Measure:</b> {selectedProduct.unitOfMeasure}</p>
            </div>
          </Paper>
        </Grid>
      </Grid>
    )
  }}
  </Subscribe>
</Transition>
)

export default ViewProduct
