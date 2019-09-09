package cn.joylau.code;

import cn.joylau.code.model.Message;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Created by joylau on 19-8-16
 */
@CrossOrigin
@Controller
public class LoginController {

    private ConcurrentMap<String, List<JSONObject>> macInfos = new ConcurrentHashMap<>();

    @RequestMapping("/")
    public String index(HttpServletRequest request) {
        request.getSession(true);
        return "login";
    }

    @RequestMapping("/main")
    public String main() {
        return "main";
    }

    @ResponseBody
    @GetMapping("/getSessionId")
    public JSONObject getSessionId(HttpServletRequest request) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sessionId", request.getSession().getId());
        return jsonObject;
    }

    @ResponseBody
    @GetMapping("/getMacInfo")
    public List<JSONObject> getMacInfo(HttpServletRequest request) {
        String sessionId = request.getSession().getId();
        long time = System.currentTimeMillis();
        List<JSONObject> macInfo = macInfos.get(sessionId);
        while (System.currentTimeMillis() - time < 20 * 1000 && macInfo == null) {
            macInfo = macInfos.get(sessionId);
        }
        return macInfo == null ? new ArrayList<>() : macInfo;
    }


//    @Deprecated
//    @ResponseBody
//    @PostMapping("/sendMac")
//    public void sendMac(@RequestBody String message) {
//        message = message.replace("\\", "\\\\").replaceFirst(";", "");
//        JSONObject info = JSONObject.parseObject(message);
//        String sessionId = info.getString("sessionId");
//        String macInfo = info.getString("macInfo");
//
//        List<String> macList = Arrays.stream(macInfo.split(";")).collect(Collectors.toList());
//        List<JSONObject> groupMac = new ArrayList<>();
//        int number = macList.size() / 4;
//        for (int i = 0; i < number; i++) {
//            List<String> value = macList.subList(i * 4, i * 4 + 4);
//            JSONObject jo = new JSONObject();
//            value.forEach(str -> jo.put(str.split(":")[0].replaceAll(" ", ""), str.split(":")[1].trim()));
//            groupMac.add(jo);
//        }
//        macInfos.put(sessionId, groupMac);
//    }


    @ResponseBody
    @PostMapping("/sendMac")
    public void sendMac(@RequestBody Message message) {
        List<JSONObject> infos = new ArrayList<>();
        JSONObject macInfo = message.getMacInfo();
        if (null == macInfo) return;
        macInfo.keySet()
                .forEach(key ->
                        macInfo.getJSONArray(key)
                                .forEach(o -> {
                                    LinkedHashMap info = (LinkedHashMap) o;
                                    if (info.get("family").equals("IPv4") && !info.get("mac").equals("00:00:00:00:00:00")) {
                                        JSONObject json = new JSONObject();
                                        json.put("name", key);
                                        json.put("mac", info.get("mac"));
                                        json.put("ip", info.get("address"));
                                        infos.add(json);
                                    }
                }));
        macInfos.put(message.getSessionId(),infos);

    }
}
