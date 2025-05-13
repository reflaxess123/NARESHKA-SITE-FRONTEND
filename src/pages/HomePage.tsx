import { Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const HomePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Добро пожаловать на Главную страницу!</Title>
      <p>Это публичная страница, доступная всем пользователям.</p>
    </div>
  );
};

export default HomePage;
