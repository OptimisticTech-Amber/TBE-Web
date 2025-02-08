import { routes } from '@/constant';
import useApi from './useApi';
import { useState, useEffect } from 'react';
import { NotificationItemProps } from '@/interfaces';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { makeRequest } = useApi('notifications');

  useEffect(() => {
    makeRequest({
      method: 'GET',
      url: routes.api.notification,
    })
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [notifications]);

  return { notifications, loading };
};

export default useNotifications;
