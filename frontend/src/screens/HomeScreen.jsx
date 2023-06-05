// frontend\src\screens\HomeScreen.jsx

// External Imports
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

// Internal Imports
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { getProductsApi } from '../services/api';

// Component Definition
const HomeScreen = () => {
  // State Variables
  const { pageNumber = 1, keyword = '' } = useParams();
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsApi({ keyword, pageNumber });
        setProductsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber, keyword]);

  // Conditional Rendering
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='danger'>{error}</Message>;
  }

  // Component Render
  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      <>
        <Meta />
        <h1>Latest Products</h1>
        <Row>
          {productsData && productsData.products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        {productsData &&
          <Paginate
            pages={productsData.pages}
            page={productsData.page}
            keyword={keyword ? keyword : ''}
          />
        }
      </>
    </>
  );
};

export default HomeScreen;