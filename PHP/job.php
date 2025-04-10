<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$host = 'localhost';
$port = '5432';
$dbname = 'handyman';
$user = 'postgres';
$password = 'root';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests for login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Get JSON request body
$requestData = json_decode(file_get_contents("php://input"), true);

// REMOVE THIS LINE - this is causing the double JSON output
// echo json_encode($requestData, JSON_PRETTY_PRINT);

// Check if request data exists
if (!$requestData) {
    echo json_encode(["error" => "Invalid request format"]);
    exit;
}

try {
    $dsn = "pgsql:host=$host;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Route the request based on method and parameters
    switch ($requestData['action']) {
        case 'get_jobs_data':
            // Get all jobs
            $result = fetchJobs($pdo);
            break;

        case 'get_job':
            // Get a specific job by ID
            $result = fetchJob($pdo, $requestData['job_id']);
            break;

        default:
            // Method not supported
            http_response_code(405);
            $result = ["error" => "Method not allowed"];
            break;
    }

    // Output the result as JSON
    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    // Handle database connection or query errors
    http_response_code(500);
    $error = ["error" => "Database error: " . $e->getMessage()];
    echo json_encode($error);
} finally {
    // Close the connection
    $pdo = null;
}

/**
 * Fetch all jobs from the database
 * 
 * @param PDO $pdo Database connection
 * @return array Array of jobs
 */
function fetchJobs($pdo)
{
    $stmt = $pdo->prepare("SELECT * FROM jobs ORDER BY created_at DESC");
    $stmt->execute();

    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($jobs) > 0) {
        return $jobs;
    } else {
        http_response_code(404);
        return ["message" => "No jobs found"];
    }
}

/**
 * Fetch a single job by ID
 * 
 * @param PDO $pdo Database connection
 * @param int $id Job ID
 * @return array Job details or error message
 */
function fetchJob($pdo, $id)
{
    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE job_id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $job = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($job) {
        return $job;
    } else {
        http_response_code(404);
        return ["error" => "Job not found"];
    }
}
