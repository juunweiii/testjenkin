import { useAppContext } from '../context/appContext';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
const PrivateRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();

  if (userLoading) return <Loading />;

  if (!user) {
    return <Navigate to='/login' />;
  }
  return children;
};

export default PrivateRoute;
