// Create web server
const server = http.createServer(function (req, res) {
  // Get URL and parse it
  const parsedUrl = url.parse(req.url, true);
  // Get the path
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
  // Get the query string as an object
  const queryStringObject = parsedUrl.query;
  // Get the HTTP method
  const method = req.method.toLowerCase();
  // Get the headers as an object
  const headers = req.headers;
  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found use the notFound handler
    const chosenHandler =
      typeof router[path] !== "undefined" ? router[path] : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      path,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof payload === "object" ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log(`Returning this response: ${statusCode} ${payloadString}`);
    });
  });
});

// Start the server, and have it listen on port 3000
server.listen(config.port, function () {
  console.log(
    `The server is listening on port ${config.port} in ${config.envName} mode`
  );
});

// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = function (data, callback) {
  // Callback a http
    callback(200);
};