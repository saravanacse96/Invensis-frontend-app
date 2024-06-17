import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../Styles/page.css';

const FailurePage = () => {

    const [page, setPage] = useState(null);

    useEffect(() => {
        axios.get('/payment/failure')
            .then(response => {
                // Ensure you access the correct data structure
                if (response.data.status === 'success') {
                    setPage(response.data.data);
                } else {
                    console.error('Failed to fetch the success page:', response.data.message);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the page!', error);
            });
    }, []);

    if (!page) {
        return <div>Loading...</div>;
    }
   return (
        <div >
            <img src={`${process.env.REACT_APP_IMAGE_PATH}${page.image}`} alt={page.title}  style={{ height: 100 }} />
            <h1>{page.title}</h1>
            <p>{page.description}</p>
        </div>
    );
};

export default FailurePage;