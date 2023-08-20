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
  const [totalPages, setTotalPages] = useState(0); // Зберігає загальну кількість сторінок

  useEffect(() => {
    if (value === '') {
      return;
    }
    // якщо searchQuery введено новий то завантажуємо зображення з першої сторінки,
    // а попередній масив зображень очищаємо
    if (currentPage === 1) {
      setImages([]);
    }

    setStatus(Status.PENDING);

    imagesApi
      .fetchImages(value, currentPage)
      .then(({ hits, totalHits }) => {
        console.log('------>', hits);

        setImages(prevState => [...prevState, ...hits]);
        setTotalPages(Math.floor(totalHits / 12));
        setStatus(Status.RESOLVED);

        if (totalHits === 0) {
          throw new Error(
            `Sorry, there are no images ${value} matching your search query. Please try again.`
          );
        }
      })
      .catch(error => {
        setError(error);
        setStatus(Status.REJECTED);
      });
  }, [currentPage, value]);

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
