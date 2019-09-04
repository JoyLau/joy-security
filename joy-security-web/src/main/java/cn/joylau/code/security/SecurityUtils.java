package cn.joylau.code.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

/**
 * Created by joylau on 2019/8/22
 */
public class SecurityUtils {
    public static Authentication getAuthentication(){
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * 获取 webAuthenticationDetails
     */
    private static WebAuthenticationDetails webAuthenticationDetails(){
        return (WebAuthenticationDetails)getAuthentication().getDetails();
    }

    /**
     * 获取session id
     */
    public static String getSessionId(){
        return webAuthenticationDetails().getSessionId();
    }
}
