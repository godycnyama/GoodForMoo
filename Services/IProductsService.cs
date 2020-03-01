using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.DataModels;

namespace WebApplication1.Services
{
   public interface IProductsService
    {
        public Task<IEnumerable<Product>> GetAllProducts();
        public Task<IQueryable<Product>> GetProductsBy(SearchParameters searchParameters);
        public Task AddProduct(ProductDTO productDTO);
        public Task UpdateProduct(int id, ProductDTO productDTO);
        public Task<Product> GetProduct(int id);
        public Task DeleteProduct(int id);
    }
}
