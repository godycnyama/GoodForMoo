using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.DataModels
{
    public class SearchParameters
    {
        public SearchParameters()
        {

        }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SearchBy { get; set; }
        public string SearchTerm { get; set; }
        public string OrderBy { get; set; }
        public string Date { get; set; }
    }
}
