import { Container } from 'unstated';

class ProductsContainer extends Container {
    state = {
        _products: [],
        selectedProduct: {},
        _currentPage: 0,
        _pageTotal: 0,
        _perPage: 5,
        _searchBy:"All",
        _searchTerm: "",
        _orderBy: "ProductID asc",
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

    _setProducts = products => {
        this.setState({
            _products: products
        })
    }

    _resetProducts = () => {
        this.setState({
            _products: []
        })
    }

    setSelectedProduct = product => {
        this.setState({
            selectedProduct: product
        })
    }

    _getProduct = () => {
        return this.state.selectedProduct;
    }

    _resetSelectedProduct = () => {
        this.setState({
            selectedProduct: null
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

const _ProductsContainer = new ProductsContainer();
export default _ProductsContainer;