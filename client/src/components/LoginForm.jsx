// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  // create state of userFormData to null values
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // create state of validated user to false
  const [validated, setValidated] = useState(false);
  // create state of alert to false
  const [showAlert, setShowAlert] = useState(false);
  // create function using mutation to update user 
  const [login, { error }] = useMutation(LOGIN_USER);

  // handles input change by taking the input and setting the userFormData to those values
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // handles form submit for the login page
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // waits for login using the user form data
      const { data } = await login({
        variables: { ...userFormData },
      });

      if (error) {
        throw new Error('Something went wrong!');
      }

      // if login is correct uses user's JSON web token to sign in
      const { token, user } = data.login;
      console.log(user);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      // if login fails show an alert of the error
      setShowAlert(true);
    }

    // set user form data back to null values
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <section>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </section>
  );
};

export default LoginForm;
