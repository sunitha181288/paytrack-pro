package com.paytrack.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .headers(h -> h.frameOptions(f -> f.disable()))
                .sessionManagement(s -> s
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api-docs/**",
                                "/v3/api-docs/**",
                                "/webjars/**"
                        ).permitAll()
                        // H2 Console
                        .requestMatchers("/h2-console/**").permitAll()
                        // Actuator
                        .requestMatchers("/actuator/**").permitAll()
                        // Auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // GET transactions open for dashboard
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/transactions",
                                "/api/v1/transactions/**"
                        ).permitAll()
                        // POST transactions open for now
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/transactions"
                        ).permitAll()
                        // everything else needs auth
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}