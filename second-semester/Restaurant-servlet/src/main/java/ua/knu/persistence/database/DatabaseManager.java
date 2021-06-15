package ua.knu.persistence.database;

import java.sql.Connection;
import java.util.List;

public interface DatabaseManager {

    void execute(String sql);

    <T> T getSingleResult(String sql, Class<T> type);

    <T> List<T> getResultList(String sql, Class<T> type);

    Connection getConnection();
}
