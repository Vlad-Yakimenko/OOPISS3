package ua.knu.servlet;

import lombok.val;
import ua.knu.persistence.repository.DishRepository;
import ua.knu.service.converter.AbstractConverter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
        writer.print(AbstractConverter.getObjectMapper().writeValueAsString(dishes));
        writer.flush();
    }
}
