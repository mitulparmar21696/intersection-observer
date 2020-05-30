import React, { useReducer, useRef } from 'react';

import { useFetch, useInfiniteScroll, useLazyLoading } from './customHooks'
import { Card, Col } from 'react-bootstrap';
import './index.css';

function Test() {
  const imgReducer = (state, action) => {
    switch (action.type) {
      case 'PRODUCT_DATA':
        let uniqueProduct = []
        action.images.forEach(element => {
          let foundElement = state.images.find((e) => e.id === element.id)
          if (!foundElement) {
            uniqueProduct.push(element)
          }
        });
        return { ...state, images: state.images.concat(uniqueProduct) }
      case 'FETCHING_PRODUCT_DATA':
        return { ...state, fetching: action.fetching }
      case 'RESET_RECORD':
        return { ...state, images: action.payload.images }

      default:
        return state;
    }
  }

  const pageReducer = (state, action) => {
    switch (action.type) {
      case 'ADVANCE_PAGE':
        return { ...state, page: state.page + 1 }
      case 'RESET_PAGE':
        return { ...state, page: 0, sort: action.payload.sort }
      default:
        return state;
    }
  }
  const onSort = (event) => {
    imgDispatch({ type: 'RESET_RECORD', payload: { images: [], fetching: true } })
    pagerDispatch({ type: 'RESET_PAGE', payload: { page: 0, sort: event.target.value } })
  }

  const [pager, pagerDispatch] = useReducer(pageReducer, { page: 0, sort: 'price' })
  const [imgData, imgDispatch] = useReducer(imgReducer, { images: [], fetching: true })

  let bottomBoundaryRef = useRef(null);

  useFetch(pager, imgDispatch);
  useLazyLoading('.card-img-top', imgData.images)
  useInfiniteScroll(bottomBoundaryRef, pagerDispatch);

  const dateModifier = (date) => {

    let today, productDate, timeDifference, dayDifference;
    today = new Date();
    productDate = new Date(date);
    //Getting time difference
    timeDifference = today.getTime() - productDate.getTime();
    // get date difference based on date
    dayDifference = timeDifference / (1000 * 3600 * 24)
    dayDifference = Math.floor(dayDifference)
    return dayDifference === 0 ? "Today" : dayDifference >= 7 ? productDate.toDateString() : `${dayDifference} ${dayDifference === 1 ? "day ago" : "days ago"}`;
  }
  return (
    <div className="">
      <nav className="navbar bg-light">
        <div className="container">

          <Col xs={6}>
            <a className="navbar-brand" >
              <h2>Product List</h2>
            </a>
          </Col>
          <Col xs={6}>
            <select className="form-control ju" id="exampleFormControlSelect1" onChange={onSort}>
              <option value="price">Price</option>
              <option value="size">Size</option>
              <option value="id">Id</option>
            </select>
          </Col>

        </div>
      </nav>

      <div id='images' className="container">
        <div className="row">
          {imgData.images.map((image, index) => {
            const { face, size, price, date } = image
            return (
              <div key={index} >

                {index % 20 === 0 ? <Card style={{ width: '20rem', height: '300px', margin: '10px' }}>

                  <Card.Body>
                    <img className="ad" src={`http://localhost:8000/ads/?r=${Math.floor(Math.random() * 1000)}`} />
                  </Card.Body>
                </Card> : <Card style={{ width: '20rem', height: '300px', margin: '10px' }}>

                    <Card.Body>
                      <Card.Title style={{ lineHeight: '150px', fontSize: `${size}px` }}>{face}</Card.Title>
                      <Card.Text style={{}}>
                        Price: <span style={{ color: 'grey' }}>${price.toFixed(2)}</span>
                      </Card.Text>
                      <Card.Text >
                        Posted: <span style={{ color: 'grey' }}>{dateModifier(date)}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>}



                {/* </Row> */}
              </div>
            )
          })}
        </div>
      </div>

      {imgData.fetching && (
        <div className="text-center bg-secondary m-auto p-3">
          <p className="m-0 text-white">Getting Product</p>
        </div>
      )}
      <div id='page-bottom-boundary' style={{ border: '1px solid red' }} ref={bottomBoundaryRef}></div>
    </div>
  );
}

export default Test;
