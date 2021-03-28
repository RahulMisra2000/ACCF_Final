import React, { useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppContext from 'src/contexts/appContext';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  LogOut as UnLockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';

// Logged-in user's credentials
const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: '',
  name: 'Unsigned',
  email: ''
};

// menu-items for menu on the left-side
let items = [];

const fillUserCredentials = (usr, claims) => {
  // user.jobTitle = usr?.custom?.title ? usr.custom.title : 'Navigator';
  user.jobTitle = claims?.role ? claims.role : '';
  user.name = usr?.displayName;
  user.avatar = usr?.photoURL;
  user.email = usr?.email;
};

const populateItems = (loggedIn) => {
  items = [];
  items.push({
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  });
  if (loggedIn) {
    items.push({
      href: '/app/customers',
      icon: UsersIcon,
      title: 'Case Management'
    });
  }
  if (loggedIn) {
    items.push({
      href: '/app/referrals',
      icon: UsersIcon,
      title: 'Referrals'
    });
  }
  items.push({
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: 'Products'
  });
  if (loggedIn) {
    items.push({
      href: '/app/account',
      icon: UserIcon,
      title: 'Account'
    });
  }
  items.push({
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Settings'
  });

  if (!loggedIn) {
    items.push({
      href: '/login',
      icon: LockIcon,
      title: 'Login'
    });
  }

  // Show logout only if user is already logged in
  if (loggedIn) {
    items.push({
      href: '/login',
      icon: UnLockIcon,
      title: 'Logout',
      type: 1
    });
  }

  items.push({
    href: '/register',
    icon: UserPlusIcon,
    title: 'Register'
  });

  if (loggedIn) {
    items.push({
      href: '/404',
      icon: AlertCircleIcon,
      title: 'My Messages'
    });
  }
};

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { isLoggedIn, claimsInJwt: claims } = useContext(AppContext);

  console.log(Date.now());
  fillUserCredentials(isLoggedIn, claims);
  populateItems(isLoggedIn);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >

      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
          to="/app/account"
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.email}
        </Typography>
      </Box>

      <Divider />

      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              type={item.type}
            />
          ))}
        </List>
      </Box>

      <Box flexGrow={1} />
      <Box
        p={2}
        m={2}
        bgcolor="background.dark"
      >
        <Typography
          align="center"
          gutterBottom
          variant="h4"
        >
          Need more?
        </Typography>
        <Typography
          align="center"
          variant="body2"
        >
          Upgrade to PRO version and access 20 more screens
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          <Button
            color="primary"
            component="a"
            href="https://react-material-kit.devias.io"
            variant="contained"
          >
            See PRO version
          </Button>
        </Box>

      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
