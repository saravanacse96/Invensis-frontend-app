import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../axios';
import '../Styles/stripe.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ page }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!elements) return;

        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
            const handleChange = (event) => {
                if (event.error) {
                    setError(event.error.message);
                } else {
                    setError(null);
                }
            };
            cardElement.on('change', handleChange);

            // Cleanup the event listener on unmount
            return () => {
                cardElement.off('change', handleChange);
            };
        }
    }, [elements]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            try {
                const response = await axios.post('/checkout', {
                    payment_method: paymentMethod.id,
                    page_id: page.id,
                });

                const { client_secret } = response.data;

              const result = await stripe.confirmCardPayment(client_secret, {
                    payment_method: paymentMethod.id,
                });

               if (result.error) {
                    // Display error message and navigate to failure page
                    setError(result.error.message);
                    navigate('/failure');
               } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                    const status_response = await axios.post('/payment/status', {
                        paymentIntentId : result.paymentIntent.id,
                        page_id: page.id,
                        price: page.price,
                        description: page.description,
                        status: result.paymentIntent.status,
                        
                    });
                    if (status_response.status === 200) {
                        setSuccess('Payment successful!');
                        navigate('/success');
                    } else {
                        setError('Failed to update payment status.');
                        setLoading(false);
                    }
                    
                } else {
                    setError('Payment failed.');
                    navigate('/failure');
                }
            } catch (error) {
                setError(error.response ? error.response.data.error : error.message);
                 navigate('/failure');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="payment-container">
            <form onSubmit={handleSubmit} className="PaymentLayout">
                <h2>{page.product}</h2>
                <img src={`${process.env.REACT_APP_IMAGE_PATH}${page.image}`} alt={page.title} style={{ width: '100px' }} />
                <p>{page.description}</p>
                <p>{page.price}</p>
                <CardElement onChange={() => setError(null)} />
                <button type="submit" id="payId" disabled={!stripe || loading}>{loading ? 'Processing...' : 'Pay'}</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>{success}</div>}
            </form>
        </div>
    );
};

const Checkout = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);

    useEffect(() => {
        axios.get(`/pages/${id}`)
            .then(response => {
                setPage(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the page!', error);
            });
    }, [id]);

    return (
        <div>
            <h1>Checkout</h1>
            {page ? (
                <Elements stripe={stripePromise}>
                    <CheckoutForm page={page} />
                </Elements>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Checkout;