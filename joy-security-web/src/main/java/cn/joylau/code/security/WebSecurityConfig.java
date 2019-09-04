package cn.joylau.code.security;

import cn.joylau.code.security.handler.AuthenticationFailure;
import cn.joylau.code.security.handler.AuthenticationSuccess;
import cn.joylau.code.security.session.SessionRegistryCache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;


/**
 * Created by joylau on 19-8-19
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .anonymous().disable()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/").permitAll()
                .anyRequest().authenticated()//其他请求必须授权后访问
                .and()
                .formLogin()
                .loginPage("/")
                .loginProcessingUrl("/login")
                .successHandler(new AuthenticationSuccess())
                .failureHandler(new AuthenticationFailure())
                .permitAll()//登录请求可以直接访问
                .and()
                .logout()
                .invalidateHttpSession(true)
//                .deleteCookies("JSESSIONID")
                .permitAll()//注销请求可直接访问
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                .maximumSessions(-1)//配置并发登录，-1表示不限制
                .sessionRegistry(sessionRegistry());

    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .passwordEncoder(passwordEncoder())
                .withUser("admin")
                .password(passwordEncoder().encode("123456"))
                .roles("ADMIN");
    }

    public void configure(WebSecurity web) {
        web.ignoring().mvcMatchers("/static/**","/sendMac","/**/favicon.*","/error","/");
    }

    @Bean
    public SessionRegistryCache sessionRegistry(){
        return new SessionRegistryCache();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public AuthenticationSuccess authenticationSuccessHandler(){
        return new AuthenticationSuccess();
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler(){
        return new AuthenticationFailure();
    }
}
