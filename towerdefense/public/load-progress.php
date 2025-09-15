<?php
// Setze CORS-Header
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
$username_db = "d044c145";
$password_db = "D1h8D1h8D1h8!";
$dbname = "d044c145";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Datenbankverbindung fehlgeschlagen."]);
    exit();
}

// Daten vom Frontend empfangen
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(["success" => false, "message" => "Keine User-ID übermittelt."]);
    exit();
}

$user_id = (int)$data->user_id;

// Prüfe, ob ein Fortschrittsdatensatz für den Nutzer existiert
$stmt = $conn->prepare("SELECT xp, currency, highscore, completed_levels FROM user_progress WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Fortschritt gefunden, lade die Daten
    $progress = $result->fetch_assoc();
    echo json_encode(["success" => true, "message" => "Spielfortschritt geladen.", "progress" => $progress]);
} else {
    // Kein Fortschritt gefunden, erstelle einen neuen leeren Datensatz
    $insertStmt = $conn->prepare("INSERT INTO user_progress (user_id) VALUES (?)");
    $insertStmt->bind_param("i", $user_id);
    
    if ($insertStmt->execute()) {
        // Erfolgreich eingefügt, gib die Standardwerte zurück
        $defaultProgress = ["xp" => 0, "currency" => 0, "highscore" => 0, "completed_levels" => null];
        echo json_encode(["success" => true, "message" => "Neuer Spielfortschritt angelegt.", "progress" => $defaultProgress]);
    } else {
        echo json_encode(["success" => false, "message" => "Fehler beim Anlegen des Fortschritts."]);
    }
}

$stmt->close();
$conn->close();
?>