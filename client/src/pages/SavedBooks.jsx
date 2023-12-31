import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';
import Auth from '../utils/auth';

// SavedBooks will handle the saved books page & functionality
const SavedBooks = () => {
  // create user data
  const { data, loading } = useQuery(GET_ME);
  // create a mutation to update the user data by removing saved book
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // create state of the user data
  const [userData, setUserData] = useState({});

  // if there is user data it sets the user data to the current user's json web token
  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  // handles deleting a book from the saved books page
  const handleDeleteBook = async (bookId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // uses removeBook mutation to remove the params book
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (error) {
        throw new Error('Something went wrong!');
      }

      // removes book from local stoarge
      removeBookId(bookId);
      // sets user data to the new array of saved books
      setUserData(data.removeBook);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, says loading
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <section>
      <Container fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Container>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks?.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                      <a href={book.link} target='_blank' rel='noopener noreferrer'>
                        {book.title}
                      </a>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default SavedBooks;
