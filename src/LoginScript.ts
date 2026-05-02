import HttpHelper from "./utils/HttpHelper";
import mapManager from './configs/mapManager';

const {regClass, property} = Laya;
const Event = Laya.Event;
const STORAGE_KEY = "user_login_data";

@regClass()
export class Script extends Laya.Script {
	declare owner : Laya.Sprite;
	private currentBgmNode: Laya.SoundNode = null;
	@property({type: Laya.TextInput})
	public accountTextInput: Laya.TextInput;
	
	@property({type: Laya.Image})
	public btn: Laya.Image;
	@property({type: Laya.Image})
	public btn1: Laya.Image;
	@property({type: Laya.Image})
	public settingbtn: Laya.Image;

	@property({type: Laya.Image})
	public image: Laya.Image;

	@property({ type: Laya.Image }) // 假设 window 是个 Box 或者 Sprite
    public window: Laya.Image;

	@property({ type: Laya.Image })
    public agreeBtn: Laya.Image; // 同意并继续

    @property({ type: Laya.Image })
    public disagreeBtn: Laya.Image; // 不同意

	@property({ type: Laya.Image })
    public mitBtn: Laya.Image; // 许可

    @property({ type: Laya.Image })
    public serverBtn: Laya.Image; // 服务条款

	@property({ type: Laya.Image })
    public provBtn: Laya.Image; // 隐私协议

	private _isGuestIntent: boolean = false;
	
	//组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	onAwake(): void {
		const localData = Laya.LocalStorage.getJSON(STORAGE_KEY);

		if (localData &&  localData.account && localData.address) {
			console.log("检测到本地有登录信息，直接进大厅！");
			let http = new HttpHelper();
			http.post("/user/login", {
				account: localData.account, 
    			address: localData.address
			},this.loginCallback.bind(this));
			
			return; // 后面的按钮绑定逻辑就不需要执行了，反正都要跳走了
		}

		this.btn.on(Event.CLICK, this, () => {
            this.showPrivacyPanel(false); // 记录为正常登录
        });
		this.btn1.on(Event.CLICK, this, () => {
            this.showPrivacyPanel(true); // 记录为游客登录
        });
		this.agreeBtn.on(Event.CLICK, this, () => {
            this.handleAgree();
        });
		this.disagreeBtn.on(Event.CLICK, this, () => {
            this.window.visible = false; // 直接关闭面板
        });
		this.mitBtn.on(Event.CLICK, this, () => {
			this.playAudio("resources/sound/SE_Btn3.wav", false);
			window.open('https://cdn.newdonediner.com/mit-license.txt', '_blank');//待调整
		});
		this.serverBtn.on(Event.CLICK, this, () => {
			this.playAudio("resources/sound/SE_Btn3.wav", false);
			window.open('https://cdn.newdonediner.com/服务条款.txt', '_blank');//待调整
		});
		this.provBtn.on(Event.CLICK, this, () => {
			this.playAudio("resources/sound/SE_Btn3.wav", false);
			window.open('https://cdn.newdonediner.com/隐私协议.txt', '_blank');//待调整
		});
		if (this.window) this.window.visible = false;
		this.settingbtn.on(Event.CLICK, this, this.settingPanel);

		Laya.LocalStorage.setItem("Game_Music_IsMuted", "0");
		Laya.LocalStorage.setItem("Game_Sound_IsMuted", "0");
		
		let isSoundMuted = Laya.LocalStorage.getItem("Game_Sound_IsMuted") === "1";
		let isMusicMuted = Laya.LocalStorage.getItem("Game_Music_IsMuted") === "1";

		Laya.SoundManager.soundMuted = isSoundMuted;
		Laya.SoundManager.musicMuted = isMusicMuted;
		if (!Laya.SoundManager.musicMuted) {
            this.playAudio("resources/sound/BGM_Login.mp3", true);
        }

	}

	onEnable(): void {
        // 面板打开时，监听广播
        Laya.stage.on("MUSIC_STATE_CHANGED", this, this.onMusicStateChanged);
    }

    onDisable(): void {
        // 【极其重要】面板关闭或隐藏时，必须注销广播！否则侦听器会无限叠加！
        Laya.stage.off("MUSIC_STATE_CHANGED", this, this.onMusicStateChanged);
    }
	
	/**
	 * 预加载比较大的资源，比如音效、音乐
	 */
	preloadRes(): void{
		let resArr: Array<string> = [
			`resources/sound/BGM_Login.mp3`,
			`resources/sound/SE_Btn3.wav`
		];
		Laya.loader.load(resArr);
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
                this.playAudio("resources/sound/BGM_Login.mp3", true);
            }
        }
    }

	/**
     * 打开隐私协议面板
     * @param isGuest 是否是游客意图
     */
    private showPrivacyPanel(isGuest: boolean): void {
		this.playAudio("resources/sound/SE_Btn3.wav", false);
		const account = this.accountTextInput?.text;
		if (!account) {
				// 这里建议加个判断，避免重复添加
			this.image.skin = "./atlas/textspritesheet/注册错误文本.png";
			
			// 建议 2 秒后自动移除提示图，不然会一直叠在屏幕上
			Laya.timer.once(2000, this, () => 
					this.image.skin = ""
			);
			return;
            
            
        }
		
        this._isGuestIntent = isGuest; // 存下来，点“同意”时用
        if (this.window) {
            this.window.visible = true;
        }
    }

	/**
     * 用户点击同意后的处理
     */
    private handleAgree(): void {
		this.playAudio("resources/sound/SE_Btn3.wav", false);
        if (this.window) this.window.visible = false; // 关闭面板
        this.handleLogin(this._isGuestIntent); // 此时才真正发起登录，传入之前记录的状态
    }

	/**
	 * 登录
	 * @private
	 */
	private handleLogin(isguest: boolean): void{
		this.onLogin(isguest);
	}
	
	/**
	 * 登录请求的回调
	 * @private
	 */
	public loginCallback(data: any): any{
		if (!data) {
        this.image.skin = "./atlas/textspritesheet/登录失败.png";
        Laya.timer.once(2000, this, () => this.image.skin = "");
        return;
    	}
		if(data.errCode === 0){
			
			const dataManager = new mapManager();
			const playerInfo = data?.result?.playerInfo;
			const storageData = {
            account: data.result.userInfo.account, 
            address: data.result.userInfo.address
        	};
			Laya.LocalStorage.setJSON(STORAGE_KEY, storageData);
			dataManager.setData('gameServerInfo', data?.result?.gameServerInfo);
			dataManager.setData('userInfo',data?.result?.userInfo);
			dataManager.setData('playerInfo',playerInfo);
			if(playerInfo && playerInfo?.playerStatus >= 2) { // 判断玩家是否在房间中，如果在游戏中，则直接回到牌桌
				Laya.Scene.open("Hall.ls", false, "oldPlayer");
			} else { // 玩家不在游戏中，进入游戏大厅
				Laya.Scene.open("Hall.ls");
			}
		}
		else if (data?.errCode === -1) {
			this.image.skin = "./atlas/textspritesheet/连接失败.png";
			Laya.timer.once(2000, this, () => this.image.skin = "");
		}
	}
	
	//每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
	onUpdate(): void {}

	async onLogin(isguest: boolean) {
		
		// 生成本地用户信息
				function generateFakeAddress() {
				// 剔除容易混淆的字符，模拟真实哈希
				const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
				let result = '';
				for (let i = 0; i < 5; i++) {
					result += chars.charAt(Math.floor(Math.random() * chars.length));
				}
				// return result;
				return 11111111111111;
				}
				let address = generateFakeAddress();
				if (!isguest) {
					// try {
					// 	const result = await transact(async (wallet: any) => {
					// 		const auth = await wallet.authorize({ 
					// 			identity: {
					// 			name: '斗地主',
					// 			// 官方文档建议加上你的网站 URI，有助于提高信任度
					// 			uri: 'https://cdn.newdonediner.com',
					// 			// --- 核心改动：加上 icon 字段 ---
					// 			// 指向你网站上图标的绝对路径，例如：
					// 			icon: 'https://cdn.newdonediner.com/icon.png' ,
					// 			scope: ['solana:mainnet-beta'],
		
					// 			}
		
					// 		});
					// 		return auth.accounts[0].address;
					// 	});
					// 	if (result) address = result;
					// } catch (e) {
					// 	console.warn("钱包调用失败或用户取消，改用游客模式:", e);
					// }finally {
					// 	// 无论成功与否，都继续后续流程，游客模式也好过直接卡死在这里    
					// }
				}
				
		this.image.skin = "./atlas/textspritesheet/连接文本.png";
		let http = new HttpHelper();
		const account = this.accountTextInput?.text;
		http.post("/user/login", {account, address}, this.loginCallback.bind(this));

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
