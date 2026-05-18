package com.paytrack.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class DebugFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        chain.doFilter(req, res);

        System.out.println(">>> " + request.getMethod()
                + " " + request.getRequestURI()
                + " → " + response.getStatus());
    }

    @Override public void init(FilterConfig f) {}
    @Override public void destroy() {}
}