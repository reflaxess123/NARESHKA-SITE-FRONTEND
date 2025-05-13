import { Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store/rootStore';

const { Title, Paragraph } = Typography;

const ArticlesPage: React.FC = observer(() => {
  const { authStore } = useStore();

  return (
    <div>
      <Title level={2}>Страница Статей</Title>
      <Paragraph>Это защищенная страница.</Paragraph>
      {authStore.user && (
        <Paragraph>Вы вошли как: {authStore.user.email}</Paragraph>
      )}
      <Paragraph>Контент статей будет здесь...</Paragraph>
    </div>
  );
});

export default ArticlesPage;
