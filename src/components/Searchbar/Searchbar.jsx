import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, FormEl, Button, InputName } from './Searchbar.styled';
import PropTypes from 'prop-types';

export default function Searchbar({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Відповідає за оновлення стану
  const handleChange = e => {
    const { value } = e.currentTarget;

    setSearchQuery(value.toLowerCase());
  };

  //   Викликається під час відправлення форми
  const handleSubmit = e => {
    e.preventDefault();

    if (searchQuery.trim() === '') {
      toast.error('Please fill the form !', {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    onSubmit(searchQuery);
    setSearchQuery(searchQuery);
  };

  return (
    <Header>
      <FormEl onSubmit={handleSubmit}>
        <InputName
          type="text"
          autocomplete="off"
          autoFocus
          placeholder="Search images and photos"
          name="searchQuery"
          value={searchQuery}
          onChange={handleChange}
        />
        <Button type="submit">Search</Button>
      </FormEl>
    </Header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
