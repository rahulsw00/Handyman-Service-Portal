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

        case 'post_job':
            // Post a new job
            $result = postJob($pdo, $requestData);
            break;

        case 'make_offer':
            $result = makeOffer($pdo, $requestData);
            break;

        case 'posted_jobs':
            $result = postedJobs($pdo, $requestData);
            break;

        case 'get_job_offers':
            $result = getJobOffers($pdo, $requestData);
            break;

        case 'hire_handyman':
            $result = hireHandyman($pdo, $requestData);
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

function hireHandyman($pdo, $data)
{
    try {
        $stmt = $pdo->prepare("INSERT INTO job_assignments (job_id, handyman_id, client_id, agreed_price, agreed_hours) VALUES (:job_id, :handyman_id, :client_id, :agreed_price, :agreed_hours)");
        $stmt->bindParam(':job_id', $data['job_id'], PDO::PARAM_INT);
        $stmt->bindParam(':handyman_id', $data['handyman_id'], PDO::PARAM_INT);
        $stmt->bindParam(':client_id', $data['client_id'], PDO::PARAM_INT);
        $stmt->bindParam(':agreed_price', $data['agreed_price'], PDO::PARAM_STR);
        $stmt->bindParam(':agreed_hours', $data['agreed_hours'], PDO::PARAM_INT);
        if ($stmt->execute()) {
            // Delete the job application after hiring
            // $deleteStmt = $pdo->prepare("DELETE FROM job_applications WHERE job_id = :job_id");
            // $deleteStmt->bindParam(':job_id', $data['job_id'], PDO::PARAM_INT);
            // $deleteStmt->bindParam(':handyman_id', $data['handyman_id'], PDO::PARAM_INT);
            // $deleteStmt->execute();
            return ["success" => true, "message" => "Handyman hired successfully"];
        } else {
            return ["success" => false, "error" => "Failed to hire handyman: " . implode(", ", $stmt->errorInfo())];
        }
    } catch (PDOException $e) {
        return ["success" => false, "error" => "Database error: " . $e->getMessage()];
    }
}

function getJobOffers($pdo, $data)
{
    try {
        $stmt = $pdo->prepare("SELECT ja.*, u.first_name, u.last_name 
                       FROM job_applications ja 
                       JOIN users u ON ja.handyman_id = u.user_id 
                       WHERE ja.job_id = :job_id");
        $stmt->bindParam(':job_id', $data['job_id'], PDO::PARAM_INT);
        $stmt->execute();
        $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);


        if (count($offers) > 0) {
            return $offers;
        } else {
            http_response_code(404);
            return ["message" => "No offers found for this job"];
        }
    } catch (PDOException $e) {
        return ["success" => false, "error" => "Database error: " . $e->getMessage()];
    }
    return $offers;
}

function postedJobs($pdo, $data)
{

    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE token = :token");
    $stmt->bindParam(':token', $data['token'], PDO::PARAM_STR);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(401);
        return ["error" => "Unauthorized"];
    }

    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE client_id = :client_id ORDER BY created_at DESC");
    $stmt->bindParam(':client_id', $row['user_id'], PDO::PARAM_INT);
    $stmt->execute();
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($jobs) > 0) {
        return $jobs;
    } else {
        http_response_code(404);
        return ["message" => "No jobs found"];
    }
    return $jobs;
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

/**
 * Post a new job to the database
 * 
 * @param PDO $pdo Database connection
 * @param array $data Job data
 * @return array Success message or error
 */
function postJob($pdo, $data)
{
    try {
        // Convert the flexible timing boolean to PostgreSQL boolean format
        $flexibleTiming = $data['flexibleTiming'] ? 'true' : 'false';

        // Convert preferredDateTime to PostgreSQL timestamp format
        $preferredDateTime = date('Y-m-d H:i:s', strtotime($data['preferredDateTime']));

        // Make sure budget values are numeric
        $budgetMin = is_numeric($data['budgetRangeMin']) ? $data['budgetRangeMin'] : 0;
        $budgetMax = is_numeric($data['budgetRangeMax']) ? $data['budgetRangeMax'] : 0;

        $user = $pdo->prepare("SELECT user_id FROM users WHERE token = :token");
        $user->bindParam(':token', $data['token'], PDO::PARAM_STR);
        $user->execute();
        $userID = $user->fetch(PDO::FETCH_ASSOC);
        // Note: We do NOT include job_id in the column list
        $query = "INSERT INTO jobs (
            title, 
            description, 
            address, 
            city, 
            state, 
            postal_code, 
            preferred_date_time, 
            flexible_timing, 
            budget_range_min, 
            budget_range_max,
            client_id,
            created_at
            
        ) VALUES (
            :title, 
            :description, 
            :address, 
            :city, 
            :state, 
            :postalCode, 
            :preferredDateTime, 
            :flexibleTiming, 
            :budgetRangeMin, 
            :budgetRangeMax,
            :userID,
            NOW()
        )";

        $stmt = $pdo->prepare($query);

        // Bind parameters
        $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
        $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR);
        $stmt->bindParam(':address', $data['address'], PDO::PARAM_STR);
        $stmt->bindParam(':city', $data['city'], PDO::PARAM_STR);
        $stmt->bindParam(':state', $data['state'], PDO::PARAM_STR);
        $stmt->bindParam(':postalCode', $data['postalCode'], PDO::PARAM_STR);
        $stmt->bindParam(':preferredDateTime', $preferredDateTime, PDO::PARAM_STR);
        $stmt->bindParam(':flexibleTiming', $flexibleTiming, PDO::PARAM_STR);
        $stmt->bindParam(':budgetRangeMin', $budgetMin, PDO::PARAM_INT);
        $stmt->bindParam(':budgetRangeMax', $budgetMax, PDO::PARAM_INT);
        $stmt->bindParam(':userID', $userID['user_id'], PDO::PARAM_INT);

        // Execute the query
        if ($stmt->execute()) {
            return ["success" => true, "message" => "Job posted successfully"];
        } else {
            return ["success" => false, "error" => "Failed to post job: " . implode(", ", $stmt->errorInfo())];
        }
    } catch (PDOException $e) {
        return ["success" => false, "error" => "Database error: " . $e->getMessage()];
    }
}

function makeOffer($pdo, $data)
{
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE token = :token");
        $stmt->bindParam(':token', $data['token'], PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $pdo->prepare("SELECT client_id FROM jobs WHERE job_id = :job_id");
        $stmt->bindParam(':job_id', $data['job_id'], PDO::PARAM_INT);
        $stmt->execute();
        $jobRow = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $pdo->prepare("SELECT * FROM job_applications WHERE job_id = :job_id AND handyman_id = :handyman_id");
        $stmt->bindParam(':job_id', $data['job_id'], PDO::PARAM_INT);
        $stmt->bindParam(':handyman_id', $row['user_id'], PDO::PARAM_INT);
        $stmt->execute();
        $existingApplication = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existingApplication) {
            $deleteStmt = $pdo->prepare("DELETE FROM job_applications WHERE job_id = :job_id AND handyman_id = :handyman_id");
            $deleteStmt->bindParam(':job_id', $data['job_id'], PDO::PARAM_INT);
            $deleteStmt->bindParam(':handyman_id', $row['user_id'], PDO::PARAM_INT);
            $deleteStmt->execute();
        }
        $stmt = $pdo->prepare("INSERT INTO job_applications (
        job_id,
        handyman_id,
        price_quote, 
        availability_date, 
        additional_notes, 
        estimated_hours,
        posted_by
    ) VALUES (
        :job_id, 
        :user_id, 
        :offer_amount, 
        :available_date, 
        :additional_notes, 
        :estimated_hours,
        :client_id
    )");

        $stmt->bindParam(':job_id', $data['job_id'], PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $row['user_id'], PDO::PARAM_INT);
        $stmt->bindParam(':offer_amount', $data['offer_amount'], PDO::PARAM_STR);
        $stmt->bindParam(':available_date', $data['available_date'], PDO::PARAM_STR);
        $stmt->bindParam(':additional_notes', $data['additional_notes'], PDO::PARAM_STR);
        $stmt->bindParam(':estimated_hours', $data['estimated_hours'], PDO::PARAM_INT);
        $stmt->bindParam(':client_id', $jobRow['client_id'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            return ["success" => true, "message" => "Application posted successfully"];
        } else {
            return ["success" => false, "error" => "Failed to post applicaton: " . implode(", ", $stmt->errorInfo())];
        }
    } catch (PDOException $e) {
        return ["success" => false, "error" => "Database error: " . $e->getMessage()];
    }
}
