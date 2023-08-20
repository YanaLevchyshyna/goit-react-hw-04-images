import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = searchQuery => {
    // console.log(searchQuery);
    setSearchQuery(searchQuery);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery value={searchQuery} />
      <ToastContainer autoClose={3000} />
    </div>
  );
}
