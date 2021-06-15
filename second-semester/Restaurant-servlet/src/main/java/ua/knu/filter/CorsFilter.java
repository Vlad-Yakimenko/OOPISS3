package ua.knu.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "AuthFilter", value = "/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        ((HttpServletResponse) response).addHeader("Access-Control-Allow-Origin", "*");
        ((HttpServletResponse) response).addHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD, PUT, POST");
        ((HttpServletResponse) response).addHeader("Access-Control-Allow-Headers", "Content-Type");
        chain.doFilter(request, response);
    }

//    @Override
//    @SuppressWarnings("unchecked")
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
//        HttpServletRequest httpRequest = ((HttpServletRequest) request);
//        HttpServletResponse httpResponse = ((HttpServletResponse) response);
//
//        HttpSession session = httpRequest.getSession();
//        AtomicReference<UserRepository> userRepository = ((AtomicReference<UserRepository>) httpRequest
//                .getServletContext()
//                .getAttribute(UserRepository.class.getSimpleName()));
//
//        String username = httpRequest.getParameter(Constants.USERNAME);
//        String password = httpRequest.getParameter(Constants.PASSWORD);
//
//        Optional<User> user = userRepository.get().findByUsernameAndPassword(username, password);
//
//        if (nonNull(session.getAttribute(Constants.USERNAME)) && nonNull(session.getAttribute(Constants.PASSWORD))) {
//
//            ROLE role = (ROLE) session.getAttribute(Constants.ROLE);
//            forward(httpRequest, httpResponse, role);
//
//        } else if (user.isPresent()) {
//
//            ROLE role = user.get().getRole();
//
//            session.setAttribute(Constants.USERNAME, username);
//            session.setAttribute(Constants.PASSWORD, password);
//            session.setAttribute(Constants.ROLE, role);
//
//            forward(httpRequest, httpResponse, role);
//
//        } else {
//
//            forward(httpRequest, httpResponse, ROLE.GUEST);
//        }
//    }

//    @SneakyThrows
//    private void forward(HttpServletRequest request, HttpServletResponse response, ROLE role) {
//        if (role.equals(ROLE.ADMIN)) {
//            request.getRequestDispatcher("/WEB-INF/template/admin.jsp").forward(request, response);
//        } else if (role.equals(ROLE.USER)) {
//            request.getRequestDispatcher("/WEB-INF/template/user.jsp").forward(request, response);
//        } else {
////            request.getRequestDispatcher("/WEB-INF/template/login.jsp").forward(request, response);
//        }
//    }
}
