import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axios';
import '../Styles/page.css'

const PageList = () => {
    const [pages, setPages] = useState([]);

     useEffect(() => {
        axios.get('/pages')
            .then(response => {
                setPages(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the pages!', error);
            });
    }, []);;

    return (
        <div>
            <h1>Product List</h1>
            <div className="product-list">
                {pages
                    .filter(page => page.type === 'Payment Page')
                    .map(page => (
                        <div key={page.id} className="product-card">
                            <img src={`${process.env.REACT_APP_IMAGE_PATH}${page.image}`} alt={page.title} />
                            <h2>{page.product}</h2>
                            <p>{page.description}</p>
                            <Link to={`/checkout/${page.id}`}>Buy {page.product}</Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PageList;