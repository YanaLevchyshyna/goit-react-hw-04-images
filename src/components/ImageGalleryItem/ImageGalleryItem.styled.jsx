import styled from '@emotion/styled';

export const ImgItem = styled.li`
  display: block;
  width: calc((100% - 40px) / 3);
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: zoom-in;
  
  :nth-of-type(3n) {
    margin-right: 0;
`;

export const PhotoCard = styled.div`
  & > img {
    object-fit: cover;
    height: 250px;
    margin: 0 auto;
  }
`;
