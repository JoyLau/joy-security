package cn.joylau.code.security.handler;

import com.alibaba.fastjson.JSONObject;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by joylau on 19-8-19
 */
public class AuthenticationFailure extends SimpleUrlAuthenticationFailureHandler {
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response, AuthenticationException exception)
            throws IOException {
        String errorMessage = exception.getMessage();
        if (exception instanceof BadCredentialsException) {
            errorMessage = "用户名或密码错误!";
        }
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("success", false);
        jsonObject.put("message", "<div class=\"alert alert-danger\" role=\"alert\">"+errorMessage+"</div>");
        response.getWriter().println(JSONObject.toJSONString(jsonObject));
    }
}
