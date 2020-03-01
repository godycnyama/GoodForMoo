using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DataAccess;
using WebApplication1.DataModels;
using WebApplication1.Services;

namespace WebApplication1.Services
{
    public class CustomersService: ICustomersService
    {
        DataAccessContext db;
        public CustomersService(DataAccessContext c)
        {
            db = c;
        }
        public async Task<IEnumerable<Customer>> GetAllCustomers()
        {
            return await db.Customers.ToListAsync();
        }

        public async Task<IQueryable<Customer>> GetCustomersBy(SearchParameters searchParameters)
        {
            if (searchParameters.SearchBy == "Customer ID")
            {
                var customers = await db.Customers.Where(i => i.CustomerID == Convert.ToInt64(searchParameters.SearchTerm))
                  .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                  .Take(searchParameters.PageSize)
                  .ToListAsync();

                return sortBy(customers.AsQueryable(), searchParameters);


            }

            else if (searchParameters.SearchBy == "Customer Name")
            {
                var customers = await db.Customers.Where(i => i.CustomerName == searchParameters.SearchTerm)
                  .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                  .Take(searchParameters.PageSize)
                  .ToListAsync();

                return sortBy(customers.AsQueryable(), searchParameters);


            }
           
            else
            {
                var customers = await db.Customers
                    .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                    .Take(searchParameters.PageSize)
                    .ToListAsync();

                return sortBy(customers.AsQueryable(), searchParameters);
            };
        }
        //Add new customer record     
        public async Task AddCustomer(CustomerDTO customerDTO)
        {
            //check if customer already exists
            Customer customer = await db.Customers.Where(i => i.CustomerName == customerDTO.CustomerName ).FirstAsync();
            if (customer != null)
            {
                throw new Exception("Customer already exists");
            }
            
            Customer _customer = new Customer
            {
                CustomerName = customerDTO.CustomerName,
                PhysicalAddress = customerDTO.PhysicalAddress,
                Town = customerDTO.Town,
                PostalCode = customerDTO.PostalCode,
                Province = customerDTO.Province,
                Telephone = customerDTO.Telephone,
                Mobile = customerDTO.Mobile,
                Email = customerDTO.Email
            };
            await db.Customers.AddAsync(_customer);
            await db.SaveChangesAsync();
        }
        //Update customer record  
        public async Task UpdateCustomer(int id, CustomerDTO customerDTO)
        {
            //check if customer exists
            Customer customer = await db.Customers.FindAsync(id);
            if(customer == null)
            {
                throw new Exception("Customer not found");
            }
            customer.CustomerName = customerDTO.CustomerName;
            customer.PhysicalAddress = customerDTO.PhysicalAddress;
            customer.Town = customerDTO.Town;
            customer.PostalCode = customerDTO.PostalCode;
            customer.Province = customerDTO.Province;
            customer.Telephone = customerDTO.Telephone;
            customer.Mobile = customerDTO.Mobile;
            customer.Email = customerDTO.Email;
            //db.Entry(customer).State = EntityState.Modified;
            db.Customers.Update(customer);
            await db.SaveChangesAsync();
        }
        //Get customer record    
        public async Task<Customer> GetCustomer(int id)
        {
            return await db.Customers.FindAsync(id);
        }

        //Delete customer record     
        public async Task DeleteCustomer(int id)
        {
            //check if customer exists
            Customer customer = await db.Customers.FindAsync(id);
            if (customer == null)
            {
                throw new Exception("Customer  not found");
            }
            db.Customers.Remove(customer);
            await db.SaveChangesAsync();
        }

        private IQueryable<Customer> sortBy(IQueryable<Customer> _customers, SearchParameters searchParameters)
        {
            switch (searchParameters.OrderBy)
            {
                case "Customer ID_Asc":
                    _customers.OrderBy(on => on.CustomerID);
                    break;
                case "Customer ID_Desc":
                    _customers.OrderByDescending(on => on.CustomerID);
                    break;
                case "Customer Name_Asc":
                    _customers.OrderBy(on => on.CustomerName);
                    break;
                case "Customer Name_Desc":
                    _customers.OrderByDescending(on => on.CustomerName);
                    break;
                default:
                    _customers.OrderBy(on => on.CustomerID);
                    break;
            }
            return _customers;
        }
    }
}

