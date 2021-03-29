package ua.knu.listener;

import lombok.SneakyThrows;
import ua.knu.domain.database.DatabaseManager;
import ua.knu.domain.database.JdbcDatabaseManager;
import ua.knu.domain.repository.UserRepository;
import ua.knu.domain.repository.UserRepositoryImpl;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.concurrent.atomic.AtomicReference;

@WebListener
public class ContextListener implements ServletContextListener {

    private DatabaseManager databaseManager;
    private AtomicReference<UserRepository> userRepository;

    @Override
    @SneakyThrows
    public void contextInitialized(ServletContextEvent sce) {
        databaseManager = new JdbcDatabaseManager();
        userRepository = new AtomicReference<>(new UserRepositoryImpl(databaseManager));

        final ServletContext servletContext = sce.getServletContext();
        servletContext.setAttribute(UserRepository.class.getSimpleName(), userRepository);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        userRepository = null;
        databaseManager = null;
    }
}
