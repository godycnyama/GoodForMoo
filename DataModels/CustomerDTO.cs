using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DataModels
{
    public class CustomerDTO
    {
        public CustomerDTO()
        {

        }
        [Required]
        [MaxLength(50)]
        public string CustomerName { get; set; }
        [Required]
        [MaxLength(200)]
        public string PhysicalAddress { get; set; }
        [Required]
        [MaxLength(50)]
        public string Town { get; set; }
        [Required]
        [MaxLength(20)]
        public string PostalCode { get; set; }
        [Required]
        [MaxLength(50)]
        public string Province { get; set; }
        [MaxLength(50)]
        public string Telephone { get; set; }
        [MaxLength(50)]
        public string Mobile { get; set; }
        [MaxLength(50)]
        public string Email { get; set; }
    }
}
