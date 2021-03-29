package ua.knu.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;
import ua.knu.domain.model.User;
import ua.knu.domain.repository.UserRepository;
import ua.knu.util.Constants;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@WebServlet(name = "LoginServlet", value = "/login")
public class LoginServlet extends HttpServlet {

    private AtomicReference<UserRepository> userRepositoryAtomicReference;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        userRepositoryAtomicReference = (AtomicReference<UserRepository>) config
                .getServletContext()
                .getAttribute(UserRepository.class.getSimpleName());
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println();
        System.out.println();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSONObject jsonObject = new JSONObject(IOUtils.toString(request.getReader()));
        String username = (String) jsonObject.get(Constants.USERNAME);
        String password = (String) jsonObject.get(Constants.PASSWORD);
        Optional<User> optionalUser = userRepositoryAtomicReference.get().findByUsernameAndPassword(username, password);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.addHeader("Access-Control-Allow-Origin", "*");
        PrintWriter writer = response.getWriter();
        writer.print(new ObjectMapper().writeValueAsString(optionalUser.get())); // TODO zhest'
        writer.flush();
    }
}
