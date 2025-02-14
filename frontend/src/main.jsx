import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'
const stripePromise = loadStripe("pk_test_51PhBQ4GcNCZHUMV52KtOcZkVOCmBizgfgUQEilplmwxb031KCNGfI0V4waAJPZn9ajiYvbruz2OwjOxAknDf0BHx006D4K4j7A");
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
)
