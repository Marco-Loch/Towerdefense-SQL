<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Preflight-Anfrage behandeln und das Skript beenden
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Hier kann die JSON-Header-Definition erfolgen, da die OPTIONS-Anfrage jetzt abgefangen wurde.
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
    echo json_encode(["success" => false, "message" => "Datenbankverbindung fehlgeschlagen: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Nutzername und Passwort sind erforderlich."]);
    exit();
}

$username = $conn->real_escape_string($data->username);
$password = $data->password;

// Nutzer aus der Datenbank abrufen
$stmt = $conn->prepare("SELECT id, password_hash FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $passwordHash = $user['password_hash'];

    // Passwort überprüfen
    if (password_verify($password, $passwordHash)) {
        // Erfolgreiche Anmeldung: Gib die Nutzer-ID zurück
        echo json_encode(["success" => true, "message" => "Anmeldung erfolgreich.", "user_id" => $user['id']]);
    } else {
        // Passwort ist falsch
        echo json_encode(["success" => false, "message" => "Ungültiger Nutzername oder ungültiges Passwort."]);
    }
} else {
    // Nutzername existiert nicht
    echo json_encode(["success" => false, "message" => "Ungültiger Nutzername oder ungültiges Passwort."]);
}

$stmt->close();
$conn->close();
?>

