const request = require('request');
export default function handler(req, res) {
  // const { code } = req.query
  // res.end(`Post: ${code}`)
  // res.type('text/plain');

  request('http://localhost:3000/invoice/OL9E28E474', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.


    res.send("343423");
  });
}