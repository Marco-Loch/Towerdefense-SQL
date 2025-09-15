<?php
// Setze CORS-Header, damit dein React-Frontend zugreifen kann
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Datenbank-Zugangsdaten von All-Inkl.com
$servername = "w020a54e.kasserver.com";
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
