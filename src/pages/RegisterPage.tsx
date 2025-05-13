import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, notification, Spin, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/rootStore';

const { Title } = Typography;

const RegisterPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStore();

  const registerMutation = useMutation({
    mutationFn: (values: any) =>
      authStore.register(values.email, values.password),
    onSuccess: () => {
      notification.success({
        message: 'Регистрация успешна!',
        description: `Добро пожаловать, ${authStore.user?.email}! Теперь вы можете войти.`,
      });
      navigate('/login');
    },
  });

  const onFinish = (values: any) => {
    registerMutation.mutate(values);
  };

  if (authStore.isAuthenticated) {
    navigate('/articles');
    return null;
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Регистрация
      </Title>
      <Form name='register' onFinish={onFinish} layout='vertical'>
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
        <Form.Item
          name='confirmPassword'
          label='Подтвердите Пароль'
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Пожалуйста, подтвердите ваш пароль!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder='Подтвердите пароль'
          />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={registerMutation.isPending}
            block
          >
            {registerMutation.isPending ? <Spin /> : 'Зарегистрироваться'}
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Уже есть аккаунт? <a onClick={() => navigate('/login')}>Войти</a>
        </div>
      </Form>
    </div>
  );
});

export default RegisterPage;
