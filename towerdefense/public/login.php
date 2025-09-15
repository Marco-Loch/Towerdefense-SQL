<?php
// CORS-Header
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Datenbank-Zugangsdaten
$servername = "w020a54e.kasserver.com";
$username = "d044c145";
$password = "D1h8D1h8D1h8!";
$dbname = "d044c145";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

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

