<?php
// Setze CORS-Header als Erstes
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Preflight-Anfrage behandeln
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// JSON-Header setzen
header("Content-Type: application/json; charset=UTF-8");

// PHP-Fehler anzeigen
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Datenbank-Zugangsdaten
$servername = "localhost";
$username = "d044c145";
$password = "D1h8D1h8D1h8!";
$dbname = "d044c145";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Datenbankverbindung fehlgeschlagen."]);
    exit();
}

// Daten vom Frontend empfangen
$data = json_decode(file_get_contents("php://input"));

// Überprüfen, ob die notwendigen Daten vorhanden sind
if (!isset($data->user_id) || !isset($data->xp) || !isset($data->currency) || !isset($data->highscore) || !isset($data->completed_levels)) {
    echo json_encode(["success" => false, "message" => "Unvollständige Daten."]);
    exit();
}

$user_id = (int)$data->user_id;
$xp = (int)$data->xp;
$currency = (int)$data->currency;
$highscore = (int)$data->highscore;
$completed_levels = $conn->real_escape_string($data->completed_levels);

// Fortschritt in der Datenbank aktualisieren
$updateStmt = $conn->prepare("UPDATE user_progress SET xp = ?, currency = ?, highscore = ?, completed_levels = ?, last_played = CURRENT_TIMESTAMP WHERE user_id = ?");
$updateStmt->bind_param("iiisi", $xp, $currency, $highscore, $completed_levels, $user_id);

if ($updateStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Spielfortschritt aktualisiert."]);
} else {
    echo json_encode(["success" => false, "message" => "Fehler beim Aktualisieren des Fortschritts: " . $conn->error]);
}

$conn->close();
?>