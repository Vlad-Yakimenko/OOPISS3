package ua.knu.servlet;

import lombok.val;
import ua.knu.persistence.repository.UserRepository;
import ua.knu.service.converter.UserConverter;
import ua.knu.util.PathResolver;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicReference;

@WebServlet(name = "UserServlet", value = "/users/*")
public class UserServlet extends HttpServlet {

    private UserConverter userConverter;
    private AtomicReference<UserRepository> userRepositoryAtomicReference;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        val servletContext = config.getServletContext();

        userConverter = (UserConverter) servletContext
                .getAttribute(UserConverter.class.getSimpleName());

        userRepositoryAtomicReference = (AtomicReference<UserRepository>) servletContext
                .getAttribute(UserRepository.class.getSimpleName());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        val username = PathResolver.INSTANCE.resolveUsername(req);

        val optionalUser = userRepositoryAtomicReference.get()
                .findByUsername(username.get());

        val writer = resp.getWriter();
        writer.print(userConverter.toJson(optionalUser.get()));
        writer.flush();
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        val username = PathResolver.INSTANCE.resolveUsername(req).get();
        val balance = Integer.parseInt(req.getParameter("balance"));

        userRepositoryAtomicReference.get().updateBalance(username, balance);
    }
}
