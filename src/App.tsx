import { QueryClientProvider } from '@tanstack/react-query';
import { Layout, Menu, Spin, notification } from 'antd';
import { observer } from 'mobx-react-lite';
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

import { queryClient } from './services/queryClient';
import { useStore } from './store/rootStore';

import ArticlesPage from './pages/ArticlesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const { Header, Content, Footer } = Layout;

const ProtectedRoute = observer(() => {
  const { authStore } = useStore();

  if (authStore.isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  return authStore.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  );
});

const AppLayout = observer(() => {
  const { authStore } = useStore();

  const handleLogout = async () => {
    try {
      await authStore.logout();
      notification.success({ message: 'Выход выполнен успешно' });
      // React Router автоматически перенаправит, если текущий маршрут защищен
      // или можно принудительно Navigate('/')
    } catch {
      // Ошибка уже обработается глобальным onError в queryClient для мутаций
      // но если logout не через useMutation, то здесь:
      // notification.error({ message: 'Ошибка выхода', description: (e as Error).message });
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['home']}>
          <Menu.Item key='home'>
            <Link to='/'>Главная</Link>
          </Menu.Item>
          {authStore.isAuthenticated && (
            <Menu.Item key='articles'>
              <Link to='/articles'>Статьи</Link>
            </Menu.Item>
          )}
          {authStore.isAuthenticated ? (
            <Menu.Item
              key='logout'
              onClick={handleLogout}
              style={{ marginLeft: 'auto' }}
            >
              Выйти ({authStore.user?.email})
            </Menu.Item>
          ) : (
            <>
              <Menu.Item key='login' style={{ marginLeft: 'auto' }}>
                <Link to='/login'>Войти</Link>
              </Menu.Item>
              <Menu.Item key='register'>
                <Link to='/register'>Регистрация</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: '0 48px', marginTop: '20px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        My Awesome App ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path='/articles' element={<ArticlesPage />} />
              {/* Другие защищенные маршруты */}
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />{' '}
            {/* Редирект для несуществующих путей */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
