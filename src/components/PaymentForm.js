"use client"
import { 
    CardElement,
    useElements,
    useStripe
} from '@stripe/react-stripe-js';
import axios from 'axios'
import { useState } from 'react'

const PaymentForm = () => {
    const [amount, setAmount] = useState(0);
    const stripe = useStripe();
    const elements = useElements();

    const onSubmit = async e => {
        e.preventDefault();
        console.log("Submit form")
        const cardElement = elements?.getElement("card")
    
        try {
            if(!stripe || !cardElement) return null;
            const { data } = await axios.post("/api/create-payment-intent", {
                data: { amount }
            })
            const clientSecret = data;
        
            await stripe?.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            })
        } catch (error) {
            console.log("Error: ", error)
        }
    }
    

    return (
        <div className="flex items-center justify-center w-1/2 mx-auto bg-black bg-opacity-50">
            <form onSubmit={onSubmit} className="p-10 rounded-sm w-full">
                <h1>Make a Payment</h1>
                <input name="name" type="text" aria-label="name" placeholder="Name" />
                <CardElement />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PaymentForm;