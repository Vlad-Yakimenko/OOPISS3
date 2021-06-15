package ua.knu.persistence.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactory {
    private ConnectionFactory() {
        throw new IllegalStateException("Utility class!");
    }

    public static Connection getConnection() {
        try {
            return DriverManager.getConnection(
                    "jdbc:postgresql://localhost:5432/restaurant-servlet",
                    "postgres",
                    "Tsunami9");

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}
