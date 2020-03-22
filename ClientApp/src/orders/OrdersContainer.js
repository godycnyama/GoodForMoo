import { Container } from 'unstated';

class OrdersContainer extends Container {
    state = {
        _orders: [],
        _selectedOrder: {},
        _currentPage: 0,
        _pageTotal: 0,
        _perPage: 5,
        _searchBy:"All",
        _searchTerm: "",
        _orderBy: "OrderID asc",
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

    _setOrders = orders => {
        this.setState({
            _orders: orders
        })
    }

    resetOrders = () => {
        this.setState({
            _orders: []
        })
    }

    _setSelectedOrder = order => {
        this.setState({
            _selectedOrder: order
        })
    }

    _getOrder = () => {
        return this.state._selectedOrder;
    }

    _resetSelectedOrder = () => {
        this.setState({
            _selectedOrder: null
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

const _OrdersContainer = new OrdersContainer();
export default _OrdersContainer;