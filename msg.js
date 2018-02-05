function templateMsgItem(msg){
    var produceContent = function(arr){
        var  str = '';
        if(arr.length>1){
            for(var num = 0;num<arr.length;num++){
                if(num!=0){
                    str+=arr[num];
                }
            }
            return str;
        }else{
            return arr[0];
        }

    };
    var nameDes = function(username){
        if(((typeof  username)==="string")&&(username.length===0) ){
            username = '游客';
        }
        if(((username == "null")||(typeof username == "null")||(username == "undefined")||(typeof username == "undefined"))){
            username = '游客';
        }
        return username;
    };
    var username = nameDes($("#sesNickname").val());
    var allMsg = msg.msg.split(":");
    var msgContent = produceContent(allMsg);
    var time = msg.time;
    var timeClass = (time.length) ? "" : "hide";
    var itemClassName = '';
    var talkOrder = false;
    var orderStr = '';
    var teacherName = '';
    var talkerName = '';
    switch (msg.msgType){
        case 0://我说的
            itemClassName = 'al-single-me';
            talkerName = username+'(我)';
            break;
        case 1://别人说的
            itemClassName = 'al-single-other';
            talkerName = nameDes(msg.username);
            break;
        case 2://讲师说的
            itemClassName = 'al-single-other';
            talkerName = nameDes(msg.username)+'(主讲)';
            break;
        case 3://我对讲师说的
            itemClassName = 'al-single-talk';
            talkerName = username+'(我)';
            teacherName = nameDes(msg.tousername)+'(主讲)';
            break;
        case 4://讲师对我说的
            itemClassName = 'al-single-talk';
            teacherName = username+'(我)';
            talkerName = nameDes(msg.tousername)+'(主讲)';
            talkOrder = true;
            break;
    }
    if(talkOrder){
        orderStr = '<span class="al-msg-you">'+teacherName+'</span>'+
            '                        <span class="al-msg-my">'+talkerName+'</span>'+
            '                        <span class="al-msg-to">对</span>';
    }else{
        orderStr = '                        <span class="al-msg-my">'+talkerName+'</span>'+
            '                        <span class="al-msg-to">对</span>'+
            '                        <span class="al-msg-you">'+teacherName+'</span>';
    }

    var itemStr = '<li class="al-msg-item '+itemClassName+'"><!--只有我说：al-single-me-->'+
        '                      <div class="al-msg-user">'+
        orderStr+
        '                        <span>:</span>'+
        '                      </div>'+
        '                      <div class="al-msg-content">'+t.methods.analysisMsg(msgContent) +'</div>'+
        '                      <div class="al-msg-time '+timeClass+'">'+time+'</div>'+
        '              </li>';
    return itemStr;
}
var  talkUserId =$("#sesCustomerId").val();
DWLive.onPublicChatMessage = function (msg) {
    //三端可以相互接收消息，web端目前可以是表情和文本，app是文本，
    var resourceMsg = JSON.parse(msg);
    if(resourceMsg.userrole==='publisher'){
        resourceMsg.msgType = 2;
    }else{
        if(resourceMsg.userid==talkUserId){
            resourceMsg.msgType = 0;
        }else{
            resourceMsg.msgType = 1;
        }
    }
    var msgContent = JSON.stringify(resourceMsg);
    msgAppend(msgContent);

};

DWLive.onPrivateAnswer = function (msg) {
    var resourceMsg = JSON.parse(msg);
    resourceMsg.msgType = 4;
    var msgContent = JSON.stringify(resourceMsg);
    msgAppend(msgContent);
};
DWLive.onPrivateChatMessage = function (msg) {
    var resourceMsg = JSON.parse(msg);
    resourceMsg.msgType = 3;
    var msgContent = JSON.stringify(resourceMsg);
    msgAppend(msgContent);
};