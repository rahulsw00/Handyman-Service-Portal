<?php
// Set content type header
header('Content-Type: text/html; charset=utf-8');

// Simple router to handle different routes
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Parse the URI to get the path
$uriParts = parse_url($requestUri);
$path = $uriParts['path'];

// Handle the root route ('/')
if ($requestMethod === 'GET' && ($path === '/' || $path === '/index.php')) {
    echo 'Hello World!';
} else {
    // Return 404 for any other routes
    http_response_code(404);
    echo 'Not Found';
}

// In a real application, you would include a message like this in a log file
// echo "Example app listening on port 3000";
?>