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

// Datenbank-Zugangsdaten von All-Inkl.com
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

// Überprüfen, ob der Nutzername bereits existiert
$checkUser = $conn->prepare("SELECT id FROM users WHERE username = ?");
$checkUser->bind_param("s", $username);
$checkUser->execute();
$checkUser->store_result();

if ($checkUser->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Dieser Nutzername ist bereits vergeben."]);
    exit();
}

// Passwort sicher hashen
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Neuen Nutzer in die Datenbank einfügen
$insertUser = $conn->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
$insertUser->bind_param("ss", $username, $passwordHash);

if ($insertUser->execute()) {
    echo json_encode(["success" => true, "message" => "Registrierung erfolgreich."]);
} else {
    echo json_encode(["success" => false, "message" => "Fehler bei der Registrierung: " . $conn->error]);
}

$conn->close();
?>

