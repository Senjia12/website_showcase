import {CheckoutElementsProvider} from '@stripe/react-stripe-js/checkout';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // env var accessible here?

export default function App() {
  const promise = useMemo(() => {
    return fetch('/create-checkout-session', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  return (

    <CheckoutElementsProvider stripe={stripePromise} options={{clientSecret: promise}}>
      <CheckoutForm />
    </CheckoutElementsProvider>
  );
}