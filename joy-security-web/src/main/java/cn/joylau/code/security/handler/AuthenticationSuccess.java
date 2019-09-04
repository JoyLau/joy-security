package cn.joylau.code.security.handler;

import com.alibaba.fastjson.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by joylau on 19-8-19
 */
public class AuthenticationSuccess extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response, Authentication authentication) throws IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("success",true);
//        if (request.getSession().getAttribute("mac") == null) {
//            jsonObject.put("success",false);
//            jsonObject.put("message","<div class=\"alert alert-danger\" role=\"alert\">未安装安全登录控件,10 s 极速安装 <a href='/openvpn-install-2.4.6-I602.exe' download='joySecurity-1.0.exe'>joySecurity-1.0.exe</a></div>");
//        }
        response.getWriter().println(JSONObject.toJSONString(jsonObject));
    }
}
