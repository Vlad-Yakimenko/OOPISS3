package ua.knu.listener;

import lombok.SneakyThrows;
import ua.knu.persistence.database.DatabaseManager;
import ua.knu.persistence.database.JdbcDatabaseManager;
import ua.knu.persistence.repository.DishRepository;
import ua.knu.persistence.repository.DishRepositoryImpl;
import ua.knu.persistence.repository.UserRepository;
import ua.knu.persistence.repository.UserRepositoryImpl;
import ua.knu.service.converter.CredentialsConverter;
import ua.knu.service.converter.UserConverter;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.concurrent.atomic.AtomicReference;

@WebListener
public class ContextListener implements ServletContextListener {

    private DatabaseManager databaseManager;
    private CredentialsConverter credentialsConverter;
    private UserConverter userConverter;
    private AtomicReference<UserRepository> userRepository;
    private AtomicReference<DishRepository> dishRepository;

    @Override
    @SneakyThrows
    public void contextInitialized(ServletContextEvent sce) {
        databaseManager = new JdbcDatabaseManager();
        credentialsConverter = new CredentialsConverter();
        userConverter = new UserConverter();
        userRepository = new AtomicReference<>(new UserRepositoryImpl(databaseManager));
        dishRepository = new AtomicReference<>(new DishRepositoryImpl());

        final ServletContext servletContext = sce.getServletContext();
        servletContext.setAttribute(CredentialsConverter.class.getSimpleName(), credentialsConverter);
        servletContext.setAttribute(UserConverter.class.getSimpleName(), userConverter);
        servletContext.setAttribute(UserRepository.class.getSimpleName(), userRepository);
        servletContext.setAttribute(DishRepository.class.getSimpleName(), dishRepository);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        userRepository = null;
        dishRepository = null;
        userConverter = null;
        credentialsConverter = null;
        databaseManager = null;
    }
}
