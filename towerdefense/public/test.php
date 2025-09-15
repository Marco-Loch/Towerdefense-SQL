<?php
// PHP-Fehler anzeigen
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "d044c145";
$password = "D1h8D1h8D1h8!"; // Dein Passwort
$dbname = "d044c145";

// Verbindung herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Überprüfen der Verbindung
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

echo "Verbindung erfolgreich hergestellt!";

$conn->close();
?>