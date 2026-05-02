import SocketHelper from "./utils/SocketHelper";
import HttpHelper from "./utils/HttpHelper";
import mapManager from "./configs/mapManager";
import MainRT from "./MainRT";

const Event = Laya.Event

const {regClass, property} = Laya;
const dataManager = new mapManager();

@regClass()
export default class HallScript extends Laya.Script {
	declare owner : Laya.Sprite;
	//ws实例
	public _socket: SocketHelper;
	/** AI房间按钮 **/
	@property({type: Laya.Image})
	public aiRoomBtn: Laya.Image;
	/** 快速匹配房间按钮 **/
	@property({type: Laya.Image})
	public quickjoinRoomBtn: Laya.Image;
	/** 加入房间唤起弹框按钮 **/
	@property({type: Laya.Image})
	public joinRoomBtn: Laya.Image;

	/** 断连钱包按钮 **/
	@property({type: Laya.Image})
	public disconnectBtn: Laya.Image;

	/** 钱包地址文本框 **/
	@property({type: Laya.Label})
	public address: Laya.Label;

	/** 名称文本框 **/
	@property({type: Laya.Label})
	public name: Laya.Label;

	@property({type: Laya.Image})
	public settingbtn: Laya.Image;

	
	@property({type: Laya.TextInput})
	public roomTextInput: Laya.TextInput;
	
	/** 加入房间弹框 **/
	@property({type: Laya.Dialog})
	public joinRoomDialog: Laya.Dialog;
	/** 加入房间按钮 **/
	@property({type: Laya.Image})
	public joinBtn: Laya.Image;
	
	/** 断线，重连进房弹框 **/
	@property({type: Laya.Dialog})
	public reconnectDialog: Laya.Dialog;
	/** 断线，确定重新进房按钮 **/
	@property({type: Laya.Image})
	public enterRoomBtn: Laya.Image;
	/** 断线，重连进房弹框关闭按钮 **/
	@property({type: Laya.Image})
	public reconnectDialogClose: Laya.Image;
	
	private currentBgmNode: Laya.SoundNode = null;

	onAwake(): void {
		let isSoundMuted = Laya.LocalStorage.getItem("Game_Sound_IsMuted") === "1";
		let isMusicMuted = Laya.LocalStorage.getItem("Game_Music_IsMuted") === "1";

		Laya.SoundManager.soundMuted = isSoundMuted;
		Laya.SoundManager.musicMuted = isMusicMuted;
		if (!Laya.SoundManager.musicMuted) {
            this.playAudio("resources/sound/BGM_Lobby.mp3", true);
        }
		
	}

	preloadRes(): void{
		let resArr: Array<string> = [
			`resources/sound/BGM_Lobby.mp3`
			
		];
		let suits: string[] = ["tiao", "tong", "wan", "feng","yuan"];
		for (let i = 1; i <= 9; i++) {
        // 内层循环 条、筒、万
			for (let suit of suits) {
				// 自动拼成：resources/sound/female/g_1tiao.mp3 这种格式
				resArr.push(`resources/sound/female/g_${i}${suit}.mp3`);
			}
		}
		Laya.loader.load(resArr);
	}


    onDisable(): void {
        // 【极其重要】面板关闭或隐藏时，必须注销广播！否则侦听器会无限叠加！
        Laya.stage.off("MUSIC_STATE_CHANGED", this, this.onMusicStateChanged);
    }
	
	onMusicStateChanged(isMuted: boolean): void {
        // 1. 确保当前有背景音乐节点存在
        if (isMuted) {
            // 收到静音通知：如果当前有背景音乐，直接掐死并扬了骨灰！
            if (this.currentBgmNode) {
                this.currentBgmNode.stop();    // 停止播放（解决没有 pause 的报错）
                this.currentBgmNode.destroy(); // 直接销毁节点，释放内存
                this.currentBgmNode = null;    // 变量清空，了无牵挂
            }
        } else {
            // 收到开启通知：发现手里没有背景音乐，重新走一遍正常的播放流程
            if (!this.currentBgmNode) {
                this.playAudio("resources/sound/BGM_Lobby.mp3", true);
            }
        }
    }

	//组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	onEnable(): void {

		const localData = Laya.LocalStorage.getJSON("user_login_data");
		if (localData && localData.account && localData.address) {
			// --- 逻辑 A：处理地址显示 (前四位...后四位) ---
			const addrStr = localData.address.toString();
			if (addrStr.length > 8) {
				const start = addrStr.substring(0, 4);
				const end = addrStr.substring(addrStr.length - 4);
				this.address.text = `${start}...${end}`;
			} else {
				this.address.text = addrStr;
			}
			
			const account = localData.account.toString();
			let displayAccount = account;
        
			if (account.length > 8) {
				const head = account.substring(0, 3);          // 取前3位
				const tail = account.substring(account.length - 3); // 取后3位
				displayAccount = `${head}..${tail}`;           // 拼凑成 "xxx..xxx"
			}
			this.name.text = displayAccount;
        	this.name.color = "#ffffff"; // 默认基础颜色设为白色
		}
		// 1、登陆之后就可以通过websocket与服务端进行连接
		this._socket = SocketHelper.getInstance("");
		this._socket.connect(()=>{
			const userInfo = dataManager.getData('userInfo');
			// 通知服务端进行长连接的用户，也可以在connect的时候将 唯一标识带在请求url后面（这样会暴露）
			this._socket.sendMessage(JSON.stringify({type: "setUserId", data: userInfo.id}))
		});
		// 2、UI挂载事件
		this.aiRoomBtn.on(Event.CLICK, this, this.handleAIMatch)
		this.quickjoinRoomBtn.on(Event.CLICK, this, this.handleQuickMatch)
		this.joinRoomBtn.on(Event.CLICK, this, this.handleJoinRoomDialog)
		this.joinBtn.on(Event.CLICK, this, this.handleJoinRoom)
		this.disconnectBtn.on(Event.CLICK, this, this.disconnectwallet)
		this.settingbtn.on(Event.CLICK, this, this.settingPanel);
		Laya.stage.on("MUSIC_STATE_CHANGED", this, this.onMusicStateChanged);
		this.enterRoomBtn.on(Event.CLICK, this, this.enterRoom)
		this.reconnectDialogClose.on(Event.CLICK, this, this.handleReconnectDialogClose)
	}
	
	/**
     * 1. AI对抗 按钮绑定方法
     */
    private handleAIMatch(): void {
		this.playAudio("resources/sound/SE_Btn3.wav", false);
        const userInfo = dataManager.getData('userInfo');
        let http = new HttpHelper();
        // 告诉服务器：我要建个AI房 (加个 roomType 标识让服务器知道)
        http.post("/room/createRoom", { userId: userInfo?.id, roomType: 'ai' }, this.onCreateRoomCallback.bind(this));
    }

	
	/**
	 * 创建房间回调
	 * @param data
	 * @private
	 */
	 private onCreateRoomCallback(data: any) {
		if(!data || JSON.stringify(data) === "{}"){
			return
		}
		dataManager.setData("roomInfo", data?.result)
	}
	
	/**
	 * 唤起加入房间弹框
	 */
	handleJoinRoomDialog(): void{
		this.playAudio("resources/sound/SE_Btn3.wav", false);
		this.joinRoomDialog.visible = true
	}

	/**
	 * 断开钱包连接
	 */
	disconnectwallet(): void{
		this.playAudio("resources/sound/SE_Btn3.wav", false);
		Laya.LocalStorage.removeItem("user_login_data");

		dataManager.clearData();

		if (this._socket) {
			console.log("正在断开长连接...");
			this._socket.close(); 
			// 建议：如果你的 SocketHelper 有类似 dispose 或清理监听的方法，也可以加上
		}
		Laya.Scene.open("Login.ls");

	}
	
	/**
	 * 关闭加入房间弹框
	 */
	handleReconnectDialogClose(): void{
		this.playAudio("resources/sound/SE_Btn3.wav", false);
		const userInfo = dataManager.getData('userInfo');
		this.reconnectDialog.visible = false;
		let http = new HttpHelper();
		http.post("/room/quitRoom", {userId: userInfo?.id, roomId: userInfo?.roomId}, this.onQuitRoomCallback)
	}
	
	/**
	 * 退出房间回调方法
	 * @param data
	 * @private
	 */
	onQuitRoomCallback(data:any): void{
		console.log(data)
	}
	
	/**
     * 快速匹配
     * @private
     */
    private handleQuickMatch(): void {
		this.playAudio("resources/sound/SE_Btn3.wav", false);
        const userInfo = dataManager.getData('userInfo');
        let http = new HttpHelper();
        // 核心：只传 userId，不带 roomId。请求一个专门的 quickMatch 接口
        http.post("/room/joinRoom", {userId: userInfo?.id}, this.onJoinRoomCallback.bind(this));
    }
    
    /**
	 * 加入房间
	 * @private
	 */
	private handleJoinRoom(): void {
		this.playAudio("resources/sound/SE_Btn3.wav", false);
		if (!this.roomTextInput?.text) { //未输入房间号
			console.log("未输入房间号！！！！", this.roomTextInput?.text)
			return
		}
		const userInfo = dataManager.getData('userInfo');
		let http = new HttpHelper();
		http.post("/room/joinRoom", {userId: userInfo?.id, roomId: this.roomTextInput?.text}, this.onJoinRoomCallback.bind(this));
	}
	
	/**
	 * 加入房间
	 * @private
	 */
	private onJoinRoomCallback(data: any): void{
		if(data?.errCode === 0){
			dataManager.setData("roomInfo", data?.result);
			MainRT.getInstance().enterGameScene()
		}
		else if (data?.errCode == 20003) { 
			const roomIdStr = data?.result?.customRoomId;
            console.log(`房间 ${roomIdStr} 不存在，触发直通车：直接建房！`);
            const userInfo = dataManager.getData('userInfo');
            let http = new HttpHelper();
            // 带着刚才输入的房间号，请求服务器强制建立这个特定号码的房间
            http.post("/room/createRoom", { userId: userInfo?.id, customRoomId: roomIdStr, roomType: '' }, this.onCreateRoomCallback.bind(this));
        }
		else{
			console.log("加入房间失败，失败原因：", data?.errMsg);	
		}
	}
	
	/**
	 * 断线之后，重连且重新进房
	 * @private
	 */
	private enterRoom(): void{
		this.playAudio("resources/sound/SE_Btn3.wav", false);
		
		Laya.Scene.open("Game.ls", true, "oldPlayer");
	}

	settingPanel() : void
	{
		this.playAudio("resources/sound/SE_Btn3.wav", false);
		// 1. 防手抖：去舞台上找找是不是已经打开过这个面板了
        let existPanel = Laya.stage.getChildByName("MySettingPanel")as Laya.Sprite; 
        if (existPanel) {
            // 如果已经打开过，直接显示出来就行，别重复加载了
            existPanel.visible = true;
            return;
        }

        // 2. 加载并创建预制体
        Laya.loader.load("resources/设置面板.lh").then((prefab: Laya.Prefab) => {
            if (!prefab) return; // 防报错

            // 创建出面板实体
            let panel = prefab.create() as Laya.Sprite;
            
            // 给它起个名字，下次打开时就能通过 getChildByName 找到了
            panel.name = "MySettingPanel"; 


			
            // 3. 把面板加到舞台（stage）的最顶层
            Laya.stage.addChild(panel);
        });
	}

	playAudio(type: string, isMusic: boolean): void {
		if (isMusic && Laya.SoundManager.musicMuted) {
            return;
        }
		if (!isMusic && Laya.SoundManager.soundMuted){
			return;
		}
		
		
		let sound = new Laya.SoundNode();
			// 添加到舞台
		sound.source = type;
		sound.loop = 0;
		sound.autoPlay = true;
		sound.isMusic = isMusic;
		sound.play(isMusic ? 0 : 1, Laya.Handler.create(this, this.playAudioCb, [sound]));
        
        this.owner.addChild(sound);

		if (isMusic) {
            this.currentBgmNode = sound;
        }
	}
	playAudioCb(sound: Laya.SoundNode): void {
	
		sound.destroy();
	}
}
