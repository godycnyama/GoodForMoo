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
    public class CustomersController : ControllerBase
    {
        private readonly ICustomersService _customersService;
        public CustomersController(ICustomersService customersService)
        {
            this._customersService = customersService;
        }
        // GET: api/customers/getAllCustomers
        [Route("api/customers/getAllCustomers")]
        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                var customers = await _customersService.GetAllCustomers();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/customers/getCustomersBy
        [Route("api/customers/getCustomersBy")]
        [HttpGet]
        public async Task<IActionResult> GetCustomersBy([FromQuery] SearchParameters searchParameters)
        {
            try
            {
                var customers = await _customersService.GetCustomersBy(searchParameters);
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // GET: api/customers/5
        [Route("api/customers/{id}")]
        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var customer = await _customersService.GetCustomer(id);
                return Ok(customer);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/customers
        [Route("api/customers")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CustomerDTO customerDTO)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _customersService.AddCustomer(customerDTO);
                return Ok("Customer record added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/customers/5
        [Route("api/customers/{id}")]
        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] CustomerDTO customerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _customersService.UpdateCustomer(id,customerDTO);
                return Ok("Customer record updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/customers/5
        [Route("api/customers/{id}")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _customersService.DeleteCustomer(id);
                return Ok("Customer record deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
