using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.DataModels
{
    [Table("Customers")]
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerID { get; set; }
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
        [MaxLength(150)]
        public string Email { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
