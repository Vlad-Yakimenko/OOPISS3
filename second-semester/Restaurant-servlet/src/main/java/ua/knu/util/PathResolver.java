package ua.knu.util;

import com.google.common.base.Splitter;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

public enum PathResolver {
    INSTANCE;

    public Optional<String> resolveUsername(HttpServletRequest req) {
        return Splitter.on('/')
                .omitEmptyStrings()
                .splitToList(req.getPathInfo())
                .stream()
                .findFirst();
    }
}
