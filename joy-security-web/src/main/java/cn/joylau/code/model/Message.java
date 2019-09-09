package cn.joylau.code.model;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

/**
 * Created by joylau on 2019-09-09.
 * cn.joylau.code.model
 * 2587038142@qq.com
 */
@Data
public class Message {
    private String sessionId;

    private JSONObject macInfo;
}
