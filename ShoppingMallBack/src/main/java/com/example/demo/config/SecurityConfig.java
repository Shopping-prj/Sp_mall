package com.example.demo.config;

import com.example.demo.config.auth.PrincipalDetailsService;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyAuthoritiesMapper;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity // 스프링 시큐리티 필터가 스프링 필터 체인에 등록됨
@EnableMethodSecurity(prePostEnabled = true) // @Secured, @PreAuthorize 어노테이션 활성화
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final PrincipalDetailsService userDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        roleHierarchy.setHierarchy("""
            ROLE_ADMIN > ROLE_MANAGER
            ROLE_MANAGER > ROLE_TEACHER
            ROLE_TEACHER > ROLE_USER
        """);
        return roleHierarchy;
    }

    @Bean
    public GrantedAuthoritiesMapper authoritiesMapper(RoleHierarchy roleHierarchy) {
        // 로그인 시 ADMIN이면 MANAGER/TEACHER/USER 권한을 자동으로 ‘추가’ 부여
        return new RoleHierarchyAuthoritiesMapper(roleHierarchy);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() throws Exception {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        //http.addFilterBefore(new CustomFilter(), BasicAuthenticationFilter.class);
        http
                .csrf(AbstractHttpConfigurer::disable)

                // ✅ CORS 설정 추가
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.addAllowedOrigin("http://localhost:3000"); // React 개발 서버 주소
                    corsConfig.addAllowedMethod("*"); // GET, POST, PUT, DELETE 등 허용
                    corsConfig.addAllowedHeader("*"); // 모든 헤더 허용
                    corsConfig.setAllowCredentials(true); // 쿠키/인증정보 포함 허용
                    return corsConfig;
                }))

                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests((requests) -> requests
                        .dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
                        .requestMatchers("/user/**", "/loginTest").authenticated() // 인증만 되면 접근 가능
                        //.requestMatchers("/teacher/**").hasAnyRole("TEACHER", "MANAGER")
                        .requestMatchers("/teacher/**").hasRole("TEACHER")
                        .requestMatchers("/manager/**").hasRole("MANAGER")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/", "/joinForm", "/api/member/join").permitAll() // 권한 없이 접근 가능
                        .anyRequest().permitAll())
                .formLogin(form -> form
                        .loginPage("/loginForm") // 사용자가 정의한 로그인 페이지
                        // loginProcess가 호출되면 시큐리티가 낚아채서 대신 로그인을 진행해줌
                        // 그래서 뭐? - 컨트롤러 클래스에 loginProcess를 만들지 않아도 됨
                        // 단 auth 패키지에 PrincipalDetails, PrincipalDetailsService 추가해야 함
                        .loginProcessingUrl("/loginProcess") // 로그인 요청 처리 URL (default: "/login")
                        .defaultSuccessUrl("/home", true) // 로그인 성공 후 이동할 페이지
                        .failureUrl("/custom-login?error=true") // 로그인 실패 시 이동할 페이지
                        .permitAll()
                )
                // 👇👇👇 로그아웃 설정 추가
                .logout(logout -> logout
                        .logoutUrl("/logout") // 로그아웃 처리 URL (기본값 "/logout")
                        .logoutSuccessUrl("/") // 로그아웃 후 이동할 URL
                        .invalidateHttpSession(true) // 세션 무효화 (기본값 true)
                        .deleteCookies("JSESSIONID") // 쿠키 삭제
                        .permitAll()
                )
                .exceptionHandling(exception -> exception.accessDeniedPage("/access-denied"));
        //아래 사용시 로그아웃 하면 모달창이 열림
        //.httpBasic(Customizer.withDefaults());
        return http.build();
    }
}