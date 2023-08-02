import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx';
import Home from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Signup from './components/SignupForm';
import Login from './components/LoginForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      }, {
        path: '/saved',
        element: <SavedBooks />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
