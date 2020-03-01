using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DataAccess;
using WebApplication1.DataModels;

namespace WebApplication1.Services
{
    public class ProductsService: IProductsService
    {
        DataAccessContext db;
        public ProductsService(DataAccessContext c)
        {
            db = c;
        }

        //Get products records
        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            return await db.Products.ToListAsync();
        }

        public async Task<IQueryable<Product>> GetProductsBy(SearchParameters searchParameters)
        {
            if (searchParameters.SearchBy == "Product ID")
            {
                var products = await db.Products.Where(i => i.ProductID == Convert.ToInt64(searchParameters.SearchTerm))
                  .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                  .Take(searchParameters.PageSize)
                  .ToListAsync();

                return sortBy(products.AsQueryable(), searchParameters);


            }

            else if (searchParameters.SearchBy == "Product Name")
            {
                var products = await db.Products.Where(i => i.ProductName == searchParameters.SearchTerm)
                  .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                  .Take(searchParameters.PageSize)
                  .ToListAsync();

                return sortBy(products.AsQueryable(), searchParameters);


            }

            else
            {
                var products = await db.Products
                    .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                    .Take(searchParameters.PageSize)
                    .ToListAsync();

                return sortBy(products.AsQueryable(), searchParameters);
            };
        }

        //Add new product record     
        public async Task AddProduct(ProductDTO productDTO)
        {
            //check if product already exists
            Product product = await db.Products.Where(i => i.ProductName == productDTO.ProductName).FirstAsync();
            if (product != null)
            {
                throw new Exception("Product already exists");
            }
            
            Product _product = new Product
            {
                ProductName = productDTO.ProductName,
                UnitPrice = productDTO.UnitPrice,
                UnitOfMeasure = productDTO.UnitOfMeasure,
                Currency = productDTO.Currency
            };
            await db.Products.AddAsync(_product);
            await db.SaveChangesAsync();
        }

        //Update product record   
        public async Task UpdateProduct(int id, ProductDTO productDTO)
        {
            Product product = await db.Products.FindAsync(id);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            product.ProductName = productDTO.ProductName;
            product.UnitPrice = productDTO.UnitPrice;
            product.UnitOfMeasure = productDTO.UnitOfMeasure;
            product.Currency = productDTO.Currency;

            db.Products.Update(product);
            await db.SaveChangesAsync();
        }

        //Get product record   
        public async Task<Product> GetProduct(int id)
        {
            return await db.Products.FindAsync(id);
        }

        //Delete product record   
        public async Task DeleteProduct(int id)
        {
            //check if product exists
            Product product = await db.Products.FindAsync(id);
            if (product == null)
            {
                throw new Exception("Product not found");
            }
            db.Products.Remove(product);
            await db.SaveChangesAsync();
        }

        private IQueryable<Product> sortBy(IQueryable<Product> _products, SearchParameters searchParameters)
        {
            switch (searchParameters.OrderBy)
            {
                case "Product ID_Asc":
                    _products.OrderBy(on => on.ProductID);
                    break;
                case "Product ID_Desc":
                    _products.OrderByDescending(on => on.ProductID);
                    break;
                case "Product Name_Asc":
                    _products.OrderBy(on => on.ProductName);
                    break;
                case "Product Name_Desc":
                    _products.OrderByDescending(on => on.ProductName);
                    break;
                default:
                    _products.OrderBy(on => on.ProductID);
                    break;
            }
            return _products;
        }
    }
}
