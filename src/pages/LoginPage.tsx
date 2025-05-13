import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, notification, Spin, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/rootStore';

const { Title } = Typography;

const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStore();

  const loginMutation = useMutation({
    mutationFn: (values: any) => authStore.login(values.email, values.password),
    onSuccess: () => {
      notification.success({
        message: 'Вход выполнен успешно!',
        description: `Добро пожаловать, ${authStore.user?.email}!`,
      });
      navigate('/articles');
    },
  });

  const onFinish = (values: any) => {
    loginMutation.mutate(values);
  };

  if (authStore.isAuthenticated) {
    navigate('/articles');
    return null;
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Вход
      </Title>
      <Form name='login' onFinish={onFinish} layout='vertical'>
        <Form.Item
          name='email'
          label='Email'
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите ваш Email!',
              type: 'email',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder='Email' />
        </Form.Item>
        <Form.Item
          name='password'
          label='Пароль'
          rules={[
            { required: true, message: 'Пожалуйста, введите ваш пароль!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='Пароль' />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loginMutation.isPending}
            block
          >
            {loginMutation.isPending ? <Spin /> : 'Войти'}
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Нет аккаунта?{' '}
          <a onClick={() => navigate('/register')}>Зарегистрироваться</a>
        </div>
      </Form>
    </div>
  );
});

export default LoginPage;
