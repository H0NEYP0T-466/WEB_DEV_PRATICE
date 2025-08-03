let http =require('http');
let server=http.createServer((request,response) =>
{
    if(request.url === '/news') {
        response.end('This is the news page');
    }
    response.end('Hello World Honeypot');
});
server.listen("8000")