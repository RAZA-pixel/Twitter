<?php
require_once 'config/database.php';

try {
    // Get database connection
    $database = Database::getInstance();
    $db = $database->getConnection();
    
    echo "Database connection successful!";
    
    // Test query
    $result = $db->secureQuery("SELECT COUNT(*) as count FROM users");
    $row = $result->fetch();
    echo "\nNumber of users: " . $row['count'];
    
} catch(Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
?> 