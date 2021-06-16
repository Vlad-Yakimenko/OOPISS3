package ua.knu.servlet;

import lombok.SneakyThrows;
import lombok.val;
import org.apache.commons.io.IOUtils;
import ua.knu.persistence.repository.UserRepository;
import ua.knu.service.converter.CredentialsConverter;
import ua.knu.service.converter.UserConverter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicReference;

@WebServlet(name = "LoginServlet", value = "/login")
public class LoginServlet extends HttpServlet {

    private CredentialsConverter credentialsConverter;
    private UserConverter userConverter;
    private AtomicReference<UserRepository> userRepositoryAtomicReference;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        val servletContext = config.getServletContext();

        credentialsConverter = (CredentialsConverter) servletContext
                .getAttribute(CredentialsConverter.class.getSimpleName());

        userConverter = (UserConverter) servletContext
                .getAttribute(UserConverter.class.getSimpleName());

        userRepositoryAtomicReference = (AtomicReference<UserRepository>) servletContext
                .getAttribute(UserRepository.class.getSimpleName());
    }

    @Override
    @SneakyThrows
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        val credentials = credentialsConverter.toEntity(IOUtils.toString(request.getReader()));
        val optionalUser = userRepositoryAtomicReference.get()
                .findByUsernameAndPassword(credentials.getUsername(), credentials.getPassword());

        PrintWriter writer = response.getWriter();
        writer.print(userConverter.toJson(optionalUser.get()));
        writer.flush();
    }
}
