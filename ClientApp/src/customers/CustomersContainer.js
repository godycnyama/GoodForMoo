import { Container } from 'unstated';

class CustomersContainer extends Container {
    state = {
        _customers: [],
        selectedCustomer: {},
        _currentPage: 0,
        _pageTotal: 0,
        _perPage: 5,
        _searchBy:"All",
        _searchTerm: "",
        _orderBy: "CustomerID asc",
        _navigation: false,
    }

    _setNavigation = navigation => {
        this.setState({
            _navigation: navigation
        })
    }

    _resetNavigation = () => {
        this.setState({
             _navigation: false
        })
    }

    _setSearchBy = searchBy => {
        this.setState({
            _searchBy: searchBy
        })
    }

    _resetSearchBy = () => {
        this.setState({
            _searchBy: ""
        })
    }

    _setSearchTerm = searchTerm => {
        this.setState({
            _searchTerm: searchTerm
        })
    }

    _resetSearchTerm = () => {
        this.setState({
            _searchTerm: ""
        })
    }

    _setOrderBy = orderBy => {
        this.setState({
            _orderBy: orderBy
        })
    }

    _resetOrderBy = () => {
        this.setState({
            _orderBy: ""
        })
    }

    _setCustomers = customers => {
        this.setState({
            _customers: customers
        })
    }

    _resetCustomers = () => {
        this.setState({
            _customers: []
        })
    }

    setSelectedCustomer = customer => {
        this.setState({
            selectedCustomer: customer
        })
    }

    _getCustomer = () => {
        return this.state.selectedCustomer;
    }

    _resetSelectedCustomer = () => {
        this.setState({
            selectedCustomer: null
        })
    }

    _setCurrentPage = page => {
        this.setState({
            _currentPage: page
        })
    }

    _resetCurrentPage = () => {
        this.setState({
            _currentPage: 1
        })
    }

    _setPageTotal = total => {
        this.setState({
            _pageTotal: total
        })
    }

    _resetPageTotal = () => {
        this.setState({
            _pageTotal: 0
        })
    }

    _setPerPage = perPage => {
        this.setState({
            _perPage: perPage
        })
    }

    _resetPerPage = () => {
        this.setState({
            _perPage: 5
        })
    }
}

const _CustomersContainer = new CustomersContainer();
export default _CustomersContainer;