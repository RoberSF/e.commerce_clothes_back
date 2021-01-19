export interface IPPayment {
    id: string;
    state: string;
    amount: number;
    status: string;
    created: string
}


//   payer: { payment_method: 'paypal' },
//   transactions: [{  amount: [Object],  description: 'Juego PS5',  related_resources: []   }],
//   create_time: '2021-01-12T10:56:38Z',
//   links: [
//     {
//       href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-L76YAZQ671605825V962711C',
//       rel: 'self',
//       method: 'GET'
//     },
//     {
//       href: 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-2AX79969NF009652H',
//       rel: 'approval_url',
//       method: 'REDIRECT'
//     },
//     {
//       href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-L76YAZQ671605825V962711C/execute',
//       rel: 'execute',
//       method: 'POST'
//     }
//   ],
//   httpStatusCode: 201
// }