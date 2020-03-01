using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DataModels;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _productsService;
        public ProductsController(IProductsService productsService)
        {
            this._productsService = productsService;
            
        }
        
        [Route("api/orders/getAllProducts")]
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var products = await _productsService.GetAllProducts();
                if(products == null)
                {
                    return BadRequest("No products found!");
                }
                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("api/orders/getProductsBy")]
        [HttpGet]
        public async Task<IActionResult> GetProductsBy()
        {
            try
            {
                var products = await _productsService.GetAllProducts();
                if (products == null)
                {
                    return BadRequest("No products found!");
                }
                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/products/5
        [Route("api/products/{id}")]
        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var product = await _productsService.GetProduct(id);
                if(product == null)
                {
                    return BadRequest("No product found!");
                }
                return Ok(product);

            } 
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/products
        [Route("api/products")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ProductDTO productDAO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _productsService.AddProduct(productDAO);
                return Ok("Product record added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/products/5
        [Route("api/products/{id}")]
        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] ProductDTO productDAO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _productsService.UpdateProduct(id, productDAO);
                return Ok("Product record updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/products/5
        [Route("api/products/{id}")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _productsService.DeleteProduct(id);
                return Ok("Product record deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
