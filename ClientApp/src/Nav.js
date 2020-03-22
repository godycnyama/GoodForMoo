import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EcoIcon from '@material-ui/icons/Eco';
import ViewListIcon from '@material-ui/icons/ViewList';
import GroupIcon from '@material-ui/icons/Group';
import Logo from './assets/images/good-for-moo-logo_200x200.png';



const drawerWidth = 240;

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

const Nav = ({children}) => {
  const [drawerOpen, setDrawerOpen] = React.useState(null);

  const history = useHistory();

  const ToggleDrawer = () => {
    if(drawerOpen){
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }
  
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
        <Hidden mdUp>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick = {ToggleDrawer}>
              <MenuIcon />
            </IconButton>
        </Hidden>
        <img src={Logo} alt="Logo" width="150" height="55"/>
        </Toolbar>
      </AppBar>
      <Hidden smUp>
        <Drawer
          open={drawerOpen}
          onClose={() => {setDrawerOpen(false)}}
          className={classes.drawer}
          variant="temporary"
          classes={{
            paper: classes.drawerPaper,
          }}
          style={{zIndex: 1099}}
        >
          <div className={classes.toolbar} />
            <MenuItem onClick={() => { setDrawerOpen(false); history.push('/')}}>
                <ListItemIcon>
                  <ViewListIcon/>
                </ListItemIcon>
                <ListItemText
                    primary="Orders"
                />
                <ListItemIcon>
                  <ChevronRightIcon/>
                </ListItemIcon>
              </MenuItem>
              <MenuItem onClick={() => { setDrawerOpen(false); history.push('/products')}}>
                <ListItemIcon>
                  <EcoIcon/>
                </ListItemIcon>
                <ListItemText
                    primary="Products"
                />
                <ListItemIcon>
                  <ChevronRightIcon/>
                </ListItemIcon>
              </MenuItem>
              <MenuItem onClick={() => { setDrawerOpen(false); history.push('/customers')}}>
                <ListItemIcon>
                  <GroupIcon/>
                </ListItemIcon>
                <ListItemText
                  primary="Customers"
                />
                <ListItemIcon>
                  <ChevronRightIcon/>
                </ListItemIcon>  
              </MenuItem>
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
            paper: classes.drawerPaper,
            }}
        >
            <div className={classes.toolbar} />
              <MenuItem onClick={() => { setDrawerOpen(false); history.push('/')}}>
                <ListItemIcon>
                  <ViewListIcon/>
                </ListItemIcon>
                <ListItemText
                    primary="Orders"
                />
                <ListItemIcon>
                  <ChevronRightIcon/>
                </ListItemIcon>
              </MenuItem>
              <MenuItem onClick={() => { setDrawerOpen(false); history.push('/products')}}>
                <ListItemIcon>
                  <EcoIcon/>
                </ListItemIcon>
                <ListItemText
                    primary="Products"
                />
                <ListItemIcon>
                  <ChevronRightIcon/>
                </ListItemIcon>
              </MenuItem>
              <MenuItem onClick={() => { setDrawerOpen(false); history.push('/customers')}}>
                <ListItemIcon>
                  <GroupIcon/>
                </ListItemIcon>
                <ListItemText
                  primary="Customers"
                />
                <ListItemIcon>
                  <ChevronRightIcon/>
                </ListItemIcon>  
              </MenuItem>
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

export default Nav