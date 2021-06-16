package ua.knu.servlet;

import lombok.val;
import org.apache.commons.io.IOUtils;
import ua.knu.persistence.repository.OrderRepository;
import ua.knu.service.converter.AbstractConverter;
import ua.knu.service.converter.OrderConverter;
import ua.knu.util.PathResolver;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicReference;

@WebServlet(name = "OrderServlet", value = "/orders/*")
public class OrderServlet extends HttpServlet {

    private AtomicReference<OrderRepository> orderRepositoryAtomicReference;
    private OrderConverter orderConverter;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        orderConverter = new OrderConverter();
        orderRepositoryAtomicReference = (AtomicReference<OrderRepository>) config.getServletContext()
                .getAttribute(OrderRepository.class.getSimpleName());
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        val username = PathResolver.INSTANCE.resolveUsername(request);

        val orders = orderRepositoryAtomicReference.get()
                .findByUsername(username.get());

        val writer = response.getWriter();
        writer.print(AbstractConverter.getObjectMapper().writeValueAsString(orders));
        writer.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        val order = orderConverter.toEntity(IOUtils.toString(request.getReader()));
        orderRepositoryAtomicReference.get().save(order);
    }
}
