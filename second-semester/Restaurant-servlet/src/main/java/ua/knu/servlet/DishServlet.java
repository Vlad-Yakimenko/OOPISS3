package ua.knu.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.val;
import ua.knu.persistence.repository.DishRepository;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicReference;

@WebServlet(name = "DishServlet", value = "/dishes")
public class DishServlet extends HttpServlet {

    private AtomicReference<DishRepository> dishRepositoryAtomicReference;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        dishRepositoryAtomicReference = (AtomicReference<DishRepository>) config
                .getServletContext()
                .getAttribute(DishRepository.class.getSimpleName());
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        val dishes = dishRepositoryAtomicReference.get().findAll();

        val writer = response.getWriter();
        writer.print(new ObjectMapper().writeValueAsString(dishes)); // TODO zhest'
        writer.flush();
    }
}
