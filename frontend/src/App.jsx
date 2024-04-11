import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, Typography } from 'antd';
import MenuComponent from './components/MenuComponent';
import User from './pages/User';
import Book from './pages/Book';
import Member from './pages/Member';
import Transaction from './pages/Transaction';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import { startCase } from 'lodash';
import Dashboard from './pages/Dashboard';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menu, setMenu] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const menus = localStorage.getItem('menus');
    if (user && menus) {
      const parsedMenus = JSON.parse(menus);
      setUser(JSON.parse(user));
      setMenu(parsedMenus);
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00B96B',
        },
      }}
    >
      <BrowserRouter>
        <Layout>
          {(isLoggedIn && menu) ? (
            <Sider>
              <div className="demo-logo-vertical">
                <Title level={4} style={{ marginBottom: '0' }}>
                  {startCase(user?.username)} <span style={{fontSize: '11px', fontWeight: '500'}}>({startCase(user?.user_type)})</span>
                </Title>
              </div>
              <MenuComponent menu={menu} setIsLoggedIn={setIsLoggedIn} />
            </Sider>
          ) : null}
          <Layout>
            {(isLoggedIn && menu) ? (
              <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Title level={4} style={{ marginBottom: '0', color: '#00b96b' }}>
                  Library Management System
                </Title>
              </Header>
            ) : null}
            <Content>
              <Routes>
                <Route path='/*' element={<Navigate to="/login" replace />} />
                <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/user/:mode?' element={<User />} />
                <Route path='/book/:mode?' element={<Book />} />
                <Route path='/member/:mode?' element={<Member />} />
                <Route path='/transaction/:mode?' element={<Transaction />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App;
