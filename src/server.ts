import http from 'http';
import { main } from './lib/setBackground'; 

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    // Set the response HTTP header with HTTP status and Content type
    res.writeHead(200, {'Content-Type': 'text/plain'});
  
    // Send the response body "Hello, world!"
    res.end('Hello, world!\n');
    main('0');
    //main(process.argv[2]);
  });

  // Listen on port 5040
server.listen(5040, () => {
    console.log('Server running at http://localhost:5040/');
  });