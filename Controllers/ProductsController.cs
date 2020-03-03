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
    [Route("/api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _productsService;
        public ProductsController(IProductsService productsService)
        {
            this._productsService = productsService;
            
        }

        // GET: /api/products/getAllProducts
        [HttpGet("getAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var products = await _productsService.GetAllProducts();
                var _products = products.ToArray();
                if(_products.Length == 0)
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

        // GET: /api/products/getProductsBy
        [HttpGet("getProductsBy")]
        public async Task<IActionResult> GetProductsBy()
        {
            try
            {
                var products = await _productsService.GetAllProducts();
                var _products = products.ToArray();
                if (_products.Length == 0)
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

        // GET: /api/products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var product = await _productsService.GetProduct(id);
                if(product == null)
                {
                    return BadRequest("Product not found!");
                }
                return Ok(product);

            } 
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: /api/products
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] ProductDTO productDTO)
        {
            try
            {
                await _productsService.AddProduct(productDTO);
                return Ok("Product record added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: /api/products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] ProductDTO productDTO)
        {
            try
            {
                await _productsService.UpdateProduct(id, productDTO);
                return Ok("Product record updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: /api/products/5
        [HttpDelete("{id}")]
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
