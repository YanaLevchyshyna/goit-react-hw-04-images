import { useState, useEffect } from 'react';
import { Loader } from 'components/Loader/Loader';
import 'react-toastify/dist/ReactToastify.css';
import imagesApi from 'services/imagesApi';
import { ImageGalleryError } from '../ImageGalleryError/ImageGalleryError';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import {
  ImgList,
  Section,
  Container,
  LoadMore,
  SiPixabaySvg,
} from './ImageGallery.styled';
import PropTypes from 'prop-types';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function ImageGallery({ value }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0); // Зберігає загальну кількість сторінок

  useEffect(() => {
    if (value === '') {
      return;
    }
    // якщо searchQuery введено новий то завантажуємо зображення з першої сторінки,
    // а попередній масив зображень очищаємо
    if (searchQuery !== value) {
      console.log('searchQuery-->', searchQuery);
      console.log('value-->', value);
      setImages([]);
      setCurrentPage(1);
      setSearchQuery(value);
    }

    setStatus(Status.PENDING);

    const fetchData = async () => {
      try {
        const { hits, totalHits } = await imagesApi.fetchImages(
          value,
          currentPage
        );

        if (totalHits === 0) {
          throw new Error(
            `Sorry, there are no images ${value} matching your search query. Please try again.`
          );
        }

        setImages(prevImages =>
          currentPage === 1 ? hits : [...prevImages, ...hits]
        );
        setTotalPages(Math.floor(totalHits / 12));
        setStatus(Status.RESOLVED);
      } catch (error) {
        setError(error);
        setStatus(Status.REJECTED);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, value]);

  const onLoadMoreClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  if (status === Status.IDLE) {
    return <SiPixabaySvg />;
  }

  if (status === Status.PENDING) {
    return <Loader />;
  }

  if (status === Status.REJECTED) {
    return <ImageGalleryError message={error.message} />;
  }

  if (status === Status.RESOLVED) {
    return (
      <Section>
        <Container>
          <ImgList>
            {images.map(image => (
              <ImageGalleryItem key={image.id} image={image} />
            ))}
          </ImgList>
          {currentPage <= totalPages &&
            images.length > 0 &&
            status !== Status.PENDING && (
              <LoadMore type="button" onClick={onLoadMoreClick}>
                Load more
              </LoadMore>
            )}
        </Container>
      </Section>
    );
  }
}

ImageGallery.propTypes = {
  value: PropTypes.string.isRequired,
};
