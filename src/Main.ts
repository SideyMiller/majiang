import mapManager from "./configs/mapManager";
import SocketHelper from "./utils/SocketHelper";
import Sprite = Laya.Sprite;
import HttpHelper from "./utils/HttpHelper";
import VBox = Laya.VBox;
import HBox = Laya.HBox;
const Event = Laya.Event;
const Image = Laya.Image;

import Tween = Laya.Tween;


const {regClass, property} = Laya;
const dataManager = new mapManager();

@regClass()
export default class Main extends Laya.Script {
	/** 游戏开始状态**/
	private _started: boolean = false
	/**游戏区域**/
	@property({type: Sprite})
	public gameLayout: Sprite;
	// 房间号label
	@property({type: Laya.Label})
	public roomNum: Laya.Label;
	
	/**桌面操作**/
	@property({type: Laya.Image})
	public readyBtn: Laya.Image;
	@property({type: Laya.Image})
	public exitBtn: Laya.Image;
	@property({type: Laya.Image})
	public settingBtn: Laya.Image;

	@property({type: Laya.Image})
	public passBtn: Laya.Image;
	@property({type: Laya.Image})
	public bumpBtn: Laya.Image;
	@property({type: Laya.Image})
	public minggangBtn: Laya.Image;
	@property({type: Laya.Image})
	public bugangBtn: Laya.Image;
	@property({type: Laya.Image})
	public angangBtn: Laya.Image;
	@property({type: Laya.Image})
	public winningBtn: Laya.Image;
	
	/**桌面状态UI相关**/
	@property({type: Laya.Image})
	public time0: Laya.Image;
	@property({type: Laya.Image})
	public time1: Laya.Image;
	@property({type: Laya.Image})
	public time2: Laya.Image;
	@property({type: Laya.Image})
	public time3: Laya.Image;
	// 指示灯资源数组
	public timesArr: Array<number> = [0,1,2,3]
	@property({type: Laya.Image})
	public countdown0: Laya.Image;
	@property({type: Laya.Image})
	public countdown1: Laya.Image;
	// 每次打牌后最多20秒倒计时
	private countdownNum: number = 2;//一会记得改  
	// 剩余多少张牌label
	@property({type: Laya.Label})
	public remainingLabel: Laya.Label;
	
	/** 打出的牌容器 **/
	@property({type: Sprite})
	public playedCards0: Sprite;
	@property({type: Sprite})
	public playedCards1: Sprite;
	@property({type: Sprite})
	public playedCards2: Sprite;
	@property({type: Sprite})
	public playedCards3: Sprite;
	@property({type: Laya.Image})
	public activePlayedImg: Laya.Image;
	/** 手牌容器 **/
	@property({type: VBox})
	public rightInHand_0: VBox;
	@property({type: HBox})
	public frontInHand: HBox;
	@property({type: VBox})
	public leftInHand_0: VBox;
	@property({type: HBox})
	public oppositeInHand_0: HBox;
	/** 碰杠牌容器 **/
	@property({type: HBox})
	public pengBox_0: HBox;
	@property({type: VBox})
	public pengBox_1: VBox;
	@property({type: HBox})
	public pengBox_2: HBox;
	@property({type: VBox})
	public pengBox_3: VBox;

	/** 头像及名称的容器 **/
	@property({type: Sprite})
	public avatarBox_0: Sprite;
	@property({type: Sprite})
	public avatarBox_1: Sprite;
	@property({type: Sprite})
	public avatarBox_2: Sprite;
	@property({type: Sprite})
	public avatarBox_3: Sprite;

	@property({type: Laya.Label})
	public name_0: Laya.Label;
	@property({type: Laya.Label})
	public name_1: Laya.Label;
	@property({type: Laya.Label})
	public name_2: Laya.Label;
	@property({type: Laya.Label})
	public name_3: Laya.Label;
	
	
	/** 结算相关 **/
	@property({type: Laya.Dialog})
	public settlementDialog: Laya.Dialog;
	@property({type: Laya.Image})
	public status: Laya.Image;
	@property({type: Laya.Sprite})
	public playerCards0: Laya.Sprite;
	@property({type: Laya.Sprite})
	public playerCards1: Laya.Sprite;
	@property({type: Laya.Sprite})
	public playerCards2: Laya.Sprite;
	@property({type: Laya.Sprite})
	public playerCards3: Laya.Sprite;
	@property({type: Laya.Image})
	public backHall: Laya.Image;
	@property({type: Laya.Image})
	public readyagain: Laya.Image;
	
	// declare owner : Laya.Sprite;
	//ws实例
	public _socket: SocketHelper;
	private bankerImg: string = "resources/apes/avatar/banker.png";
	
	private rightInHand: string = "./atlas/bback/tbgs_1.png";
	private oppositeInHand: string = "./atlas/bback/tbgs_2.png";
	private leftInHand: string = "./atlas/bback/tbgs_3.png";
	private playerNum: number = 0;
	private viewPos: Array<number> = [];
	
	private cardIdx: number;
	private tableCards: number[] = [];
	
	private activeCard: Laya.Image;    //用户当前操作的牌
	private activeCardNum: number;
	
	activeOperateCardNum: number;
	private myCardImgs: Array<Laya.Image> =[];
	private allUiCards: Array<Laya.Image> =[];   // 存储所有牌的UI节点，方便特殊操作
	
	// layaAir 引擎会在场景或网页失焦和最小化时，timer会置为0帧，timer.frameloop 会停止
	// 兼容方案： 1、用JS的setInterval  2、使用 onUpdate 生命周期
	// 一般来说也无需兼容，laya默认推荐开发者场景失焦就降为0帧，这个视情况而定
	private timeInterval:number = 1000;
	/** 开始时间 **/
	private startTime: number = 0;

	private currentBgmNode: Laya.SoundNode = null;
	
	onStart() {}
	
	/**
	 * 场景启动
	 */
	onAwake(): void {
		const userInfo = dataManager.getData("userInfo");
		const roomInfo = dataManager.getData("roomInfo");
		const gameInfo = dataManager.getData("gameInfo");
		const tableIds = gameInfo?.tableIds;
		this._socket = SocketHelper.getInstance("");
		
		this.readyBtn.visible = true;
		this.exitBtn.visible = true;
		this.roomNum.visible = true;
		this.roomNum.text = "房间号:" + "加载中" || roomInfo[userInfo?.id]?.roomId;
		this.readyBtn.on(Event.CLICK, this, this.readyGame)
		this.exitBtn.on(Event.CLICK, this, this.backToHall)
		this.settingBtn.on(Event.CLICK, this, this.settingset)
		this.passBtn.on(Event.CLICK, this, this.pass)
		this.bumpBtn.on(Event.CLICK, this, this.peng)
		this.minggangBtn.on(Event.CLICK, this, this.gang, ["minggang","杠"])
		this.bugangBtn.on(Event.CLICK, this, this.gang, ["bugang","杠"])
		this.angangBtn.on(Event.CLICK, this, this.gang, ["angang","杠"])
		this.winningBtn.on(Event.CLICK, this, this.win)
		//返回大厅
		this.backHall.on(Event.CLICK, this, () => {this.settlementDialog.visible = false ;this.backToHall();})
		//再次准备
		this.readyagain.on(Event.CLICK, this, () => {this.settlementDialog.visible = false ;this.readyGame();})
		
		let isSoundMuted = Laya.LocalStorage.getItem("Game_Sound_IsMuted") === "1";
		let isMusicMuted = Laya.LocalStorage.getItem("Game_Music_IsMuted") === "1";
		
		Laya.SoundManager.soundMuted = isSoundMuted;
		Laya.SoundManager.musicMuted = isMusicMuted;

		if (!Laya.SoundManager.musicMuted) {
            this.playAudio("背景音乐",true);
        }
		// 测试按钮
		// const testBtn = this.owner.getChildByName("testBtn")
		// testBtn.on(Event.CLICK, this, this.winning, [null])
	}
	preloadRes(): void{
		let resArr: Array<string> = [
			`resources/sound/BGM_Playing001.mp3`,
			`resources/sound/g_gang.mp3`,
			`resources/sound/peng.mp3`,
			`resources/sound/牌点击音效.mp3`,
			`resources/sound/出牌音效.mp3`,
			`resources/sound/碰音效.mp3`,
			`resources/sound/杠音效.mp3`,
			`resources/sound/胡音效.mp3`
			
		];
		Laya.loader.load(resArr);
	}

	onEnable(): void {
        // 面板打开时，监听广播
        Laya.stage.on("MUSIC_STATE_CHANGED", this, this.onMusicStateChanged);
		const roomInfo = dataManager.getData("roomInfo");
		this.renderAllPlayer(roomInfo);
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
                this.playAudio("背景音乐",true);
            }
        }
    }

	/**
	 * 绘制头像
	 * @param viewPos
	 * @param idx
	 * @private
	 */
	private renderAvatar(viewPos: number[], idx: number, playerName: string): void {
    
		let box = (this as any)[`avatarBox_${idx}`] as Laya.Sprite;
		let nameLabel = (this as any)[`name_${idx}`] as Laya.Label;
		if (!box || !nameLabel) return;
		nameLabel.text = playerName;
		let banker = box.getChildByName("banker") as Laya.Image;
		if (!banker) {
			banker = new Laya.Image(this.bankerImg);
			banker.name = "banker";
			banker.scale(2,2);
			banker.pos(155,155); 
			banker.zOrder = 3; // 保证在最上面
			box.addChild(banker);
		}
		// 根据 idx 或逻辑控制庄家显隐 (这里假设 idx 0 是庄)
		banker.visible = (idx === 0);
		
		let textureUrl: string = "";		
		if (viewPos[idx] === 0) textureUrl = "./atlas/avatar/avatar2.png";
		else if (viewPos[idx] === 1) textureUrl = "./atlas/avatar/avatar3.png";
		else if (viewPos[idx] === 2) textureUrl = "./atlas/avatar/avatar4.png";
		else if (viewPos[idx] === 3) textureUrl = "./atlas/avatar/avatar5.png";
		box.texture = Laya.loader.getRes(textureUrl);
		
	

	}

	
	/**
	 * 玩家视角的座位算法
	 * 原理如下
	 * 玩家A、B、C、D 座位如下
	   A-0 B-1 -2 D-3
			
			首先获取所有玩家的服务器位置：Index = 0，1，2，3
			加入现在是B的视角
			则：移位 = B.index 1 - 0 = 1 ，说明移动一个位置
			新座位的序号：
			B = B.index - 移位 = 1-1 = 0
			C = C.index - 移位 = 2-1 = 1
			D = D.index - 移位 = 3-1 = 2
			A = A.index - 移位 = 0 - 1 = -1，如果是负数，则+总人数4：-1+4=3
			
			同理：C的视角
			移位= C.index 2-0 = 2
			C = C.index - 移位 = 2-2 = 0
			D = D.index - 移位 = 3-2 = 1
			A = A.index - 移位 = 0 - 2 = -2，如果是负数，则+总人数4：-2+4=2
			B = B.index - 移位 = 1 - 2 = -1，如果是负数，则+总人数4：-1+4=3
			
			同理：D的视角
			移位= D.index 3-0 = 3
			D = D.index - 移位 = 3 - 3 = 0
			A = A.index - 移位 = 0 - 3 = -3，如果是负数，则+总人数4：-3+4=1
			B = B.index - 移位 = 1 - 3 = -2，如果是负数，则+总人数4：-2+4=2
			C = C.index - 移位 = 2 - 3 = -1，如果是负数，则+总人数4：-1+4=3
	 */
	private getPlayerViewPos(move: number, keys: Array<string>): Array<number> {
		return keys.map((k, idx)=>{
			return this.getViewPos(idx,move,keys.length);
		})
	}
	
	/**
	 * 获取单个客户端位置（参照视角玩家）
	 * @param pos 视角玩家的服务端位置
	 * @param move 视角玩家调整到靠显示器一侧的移位
	 * @param len 玩家数量
	 */
	getViewPos(pos: number, move: number, len: number): number {
		return pos - move >= 0 ? pos - move : pos - move + len;
	}
	
	/**
	 * 绘制全部玩家头像
	 * @private
	 */
	private renderAllPlayer(roomInfo: any): void {
		const userInfo = dataManager.getData("userInfo");
		const gameInfo = dataManager.getData("gameInfo");
		const tableIds = gameInfo?.tableIds;
		if (!roomInfo || JSON.stringify(roomInfo) === "{}") return
		this.playerNum = tableIds?.length;
		const meIdx: number = tableIds.findIndex((o: string) => o == userInfo?.id);
		
		const viewPos: Array<number> = this.viewPos = this.getPlayerViewPos(meIdx, tableIds)


		const banker = this.owner.getChildByName("banker")
		banker?.removeSelf()
		tableIds.map((o: string, idx: number)=>{

			const playerName = roomInfo[o]?.name;
			this.renderAvatar(viewPos, idx, playerName)
			
		});

	}
	
	/**
	 * 有玩家进入房间
	 */
	joinRoom(roomInfo: any): void{
		if(!roomInfo){
			roomInfo = dataManager.getData("roomInfo");
		}
		const userInfo = dataManager.getData("userInfo");
		this.roomNum.text = "房间号:" + roomInfo[userInfo?.id]?.roomId;
		this.renderAllPlayer(roomInfo);
	}

	/**
	 * 游戏准备
	 * @private
	 */
	readyGame(): void {
		this.playAudio("按钮", false);
		const roomInfo = dataManager.getData("roomInfo");
		const userInfo = dataManager.getData("userInfo");
		const roomId = roomInfo[userInfo?.id]?.roomId || localStorage.getItem('roomid');
		
		localStorage.setItem('roomid',roomId);
        const playerId = userInfo?.id;
		// const gameInfo = dataManager.getData("gameInfo");
		// const tableIds = gameInfo?.tableIds;
		// const room = roomInfo[userInfo?.id];
		// todo 玩家数量检测，开发时可以注销
		// if (tableIds.length < this.allowPlayerCount){
		// 	return;
		// }
		// if (!room?.isHomeOwner) { // 仅有房主能开始游戏
		// 	return
		// }
		// this.playerNum = tableIds?.length;
		// const meIdx: number = tableIds.findIndex((o: string) => o == userInfo?.id);
		// const viewPos: Array<number> = this.viewPos = this.getPlayerViewPos(meIdx, tableIds)
		// const roomId = roomInfo[userInfo?.id]?.roomId;
		// this._socket.sendMessage(JSON.stringify({type: "startGame", roomId}))
		// this.startBtn.visible = false;
		let http = new HttpHelper();
        // 【核心修改】：老老实实走 HTTP 短连接，参数对齐服务端！
        http.post("/room/ready", { 
            roomId: roomId, 
            playerId: playerId, 
            status: 1 
        }, this.onReadyCallback.bind(this));
		this.readyBtn.visible = false;
	}
	private onReadyCallback(data: any) {
        if(data?.errCode !== 0) {
            console.log("准备失败:", data?.errMsg);
            this.readyBtn.visible = true;
			this.exitBtn.visible = true; // 失败了把按钮放回来
        }
    }

	settingset(): void
	{
		this.playAudio("按钮", false);
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
	/**
	 * 断线重连，获取全部数据
	 */
	getDataByPlayerId(): void{
		const userInfo = dataManager.getData("userInfo");
		this._socket.sendMessage(JSON.stringify({type: "reconnect", data: {userId: userInfo?.id}}))
		this.readyBtn.visible = false;
		this.exitBtn.visible = false;
		this._started = true;
		

	} 
	
	/**
	 * 初始化玩家视角位置
	 */
	initViewPos(): void {
		const userInfo = dataManager.getData("userInfo");
		const gameInfo = dataManager.getData("gameInfo");
		const tableIds = gameInfo?.tableIds;
		this.playerNum = tableIds?.length;
		const meIdx: number = tableIds.findIndex((o: string) => o == userInfo?.id);
		const viewPos: Array<number> = this.viewPos = this.getPlayerViewPos(meIdx, tableIds)
		const roomInfo = dataManager.getData("roomInfo");
		this.roomNum.text = "房间号:" + roomInfo[userInfo?.id]?.roomId;
	}
	
	/**
	 * 获取手牌的图片资源
	 */
	getHandCardImageUrl(num: number): string{
		let unit = ""
		let unitNum = 0
		if(num > 210){
			unit = "b6"
			unitNum = num % 10 // 211→1, 212→2, 221→1, 224→4
		}else{
			const mod = num % 50
			unit = mod >= 41 && mod <= 44 ? "b4"   // 风
				: mod >= 31 && mod <= 39 ? "b2"   // 筒
				: mod >= 21 && mod <= 29 ? "b3"   // 条
				: mod >= 11 && mod <= 19 ? "b1"   // 万
				: mod >= 1  && mod <= 3  ? "b5"   // 三元
				: ""
			unitNum = mod % 10
		}
		return `./atlas/mycard/p4${unit}_${unitNum}.png`
	}
	
	/**
	 * 获取打出去的牌的图片资源
	 * @param num
	 * @param viewPosNum
	 */
	getPlayedCardsImageUrl(num: number, viewPosNum: number): string{
		let unit = ""
		let unitNum = 0
		if(num > 210){
			unit = "s6"
			unitNum = num % 10 // 211→1, 212→2, 221→1, 224→4
		}else{
			const mod = num % 50
			unit = mod >= 41 && mod <= 44 ? "s4"   // 风
				: mod >= 31 && mod <= 39 ? "s2"   // 筒
				: mod >= 21 && mod <= 29 ? "s3"   // 条
				: mod >= 11 && mod <= 19 ? "s1"   // 万
				: mod >= 1  && mod <= 3  ? "s5"   // 三元
				: ""
			unitNum = mod % 10
		}	
		const posFolder = viewPosNum === 0 ? 'first' : viewPosNum === 1 ? 'second' : viewPosNum === 2 ? 'third' : viewPosNum === 3 ? 'fourth' : "";
		const posNum = viewPosNum === 0 ? '4' : viewPosNum === 1 ? '1' : viewPosNum === 2 ? '2' : viewPosNum === 3 ? '3' : "";
		return `./atlas/${posFolder}/p${posNum}${unit}_${unitNum}.png`
	}
	
	
	/**
	 * 绘制手牌（修复了碰杠牌叠影内存泄漏问题）
	 */
	renderHandCards(idx: number, handCards: number[], pengCards: number[] = [], gangCards: number[] = []): void{
		this.myCardImgs = [];
		const k = 1.5; // 放大倍率

		// 💡 统一获取碰/杠操作牌
		const operateCards = pengCards.concat(gangCards);

		if (this.viewPos[idx] === 0) { // 【自己】
			let handBox = this.frontInHand;
            let opBox = this.pengBox_0;
			handBox.destroyChildren();
            opBox.destroyChildren();
			
            
            // 处理碰/杠牌
            opBox.space = 5 * k;
             
            operateCards?.forEach((p: number) => {
                let img = new Image(this.getPlayedCardsImageUrl(p, this.viewPos[idx]));
                img.size(44 * k, 46 * k); 
                img.name = `pengCard`;
                opBox.addChild(img);
            });
			// 处理手牌
            
            handCards?.forEach((h: number, childIdx: number) => {
                let imgUrl = this.getHandCardImageUrl(h);
                let img = new Image(imgUrl);
                img.size(65 * k, 99 * k); 
                img.name = `myCard`;
                this.myCardImgs.push(img);
                img.on(Event.CLICK, this, this.handleCardClick, [img, h]);
                handBox.addChild(img);
            });
			
		} else if (this.viewPos[idx] === 1) { // 【右边】
			let handBox = this.rightInHand_0;
            let opBox = this.pengBox_1;
			handBox.destroyChildren();
            opBox.destroyChildren();

			
            opBox.space = 0;
            
            operateCards?.forEach((p: number) => {
                let img = new Image(this.getPlayedCardsImageUrl(p, this.viewPos[idx]));
                img.size(44 * k, 36 * k); 
                img.name = `pengCard`;
                opBox.addChild(img);
            });

            // 处理手牌
          
            handBox.space = -36 * k;
            handCards?.forEach((h: number, childIdx: number) => {
                let img = new Image(this.rightInHand);
                img.scale(k, k); 
                img.name = `rightInHand${childIdx}`;
                img.pos(0, (20 * k) * childIdx);
                handBox.addChild(img);
            });
			
		} else if (this.viewPos[idx] === 2) { // 【对面】
			let handBox = this.oppositeInHand_0;
            let opBox = this.pengBox_2;
			handBox.destroyChildren();
            opBox.destroyChildren();
			
			// 处理碰/杠牌
            opBox.space = 5 * k;
           
            operateCards?.forEach((p: number) => {
                let img = new Image(this.getPlayedCardsImageUrl(p, this.viewPos[idx]));
                img.size(44 * k, 46 * k);
                img.name = `pengCard`;
                opBox.addChild(img);
            });

            // 处理手牌
            
            handCards?.forEach((h: number, childIdx: number) => {
                let img = new Image(this.oppositeInHand);
                img.size(44 * k, 72 * k); 
                img.pos(childIdx * (44 * k), 0);
                img.name = `handCard-${idx}-${childIdx}`;
                handBox.addChild(img);
            });
			
		} else if (this.viewPos[idx] === 3) { // 【左边】
			let handBox = this.leftInHand_0;
            let opBox = this.pengBox_3;

            handBox.destroyChildren();
            opBox.destroyChildren();

			
			// 处理碰/杠牌
            opBox.space = 0;
            
            operateCards?.forEach((p: number) => {
                let img = new Image(this.getPlayedCardsImageUrl(p, this.viewPos[idx]));
                img.size(44 * k, 36 * k);
                img.name = `pengCard`;
                opBox.addChild(img);
            });

            // 处理手牌
            
            handBox.space = -36 * k;
            handCards?.forEach((h: number, childIdx: number) => {
                let img = new Image(this.leftInHand);
                img.scale(k, k); 
                img.name = `leftInHand${childIdx}`;
                img.pos(0, (20 * k) * childIdx);
                handBox.addChild(img);
            });
			
		}
	}
	
	/**
	 * 选中牌
	 * @param y
	 * @param name
	 * @param childIdx
	 * @param cardNum
	 * @private
	 */
	private handleCardClick(cardNode: Laya.Image, cardNum: number): void {
		if (cardNum >= 211 && cardNum <= 218) return;
		let permission = this.checkCanOperate()
		if(!permission) return

		if (cardNode.y === 0) {
			cardNode.y = cardNode.y - (50 * 2.0);
			let numChildren = this.frontInHand.numChildren;
			for (let i = 0; i < numChildren; i++) {
				let siblingNode = this.frontInHand.getChildAt(i) as Laya.Image;
				// 只要不是当前点击的这张牌，统统按下去
				if (siblingNode !== cardNode) {
					siblingNode.y = 0;
				}
			}
			this.playAudio("牌点击",false);
		} else {
			this.activeCard = cardNode;
			this.handleCardPlay(cardNum);
		}
	}
	
	/**
	 * 出牌
	 */
	public handleCardPlay(cardNum: number): void{
		const roomInfo = dataManager.getData("roomInfo");
		const userInfo = dataManager.getData("userInfo");
		const roomId = roomInfo[userInfo?.id]?.roomId;
		this._socket.sendMessage(JSON.stringify({type: "playCard", data: {roomId, cardNum, userId: userInfo?.id}}))
		this.activeCardNum = cardNum;
		if(this.bumpBtn.visible) this.bumpBtn.visible = false;
		if(this.minggangBtn.visible) this.minggangBtn.visible = false;
		if(this.bugangBtn.visible) this.bugangBtn.visible = false;
		if(this.angangBtn.visible) this.angangBtn.visible = false;
		if(this.winningBtn.visible) this.winningBtn.visible = false;
		this.playAudio("出牌",false);
		
	}
	
	/**
	 * 20秒倒计时之后，玩家仍未出牌，则系统AI直接辅助出牌
	 */
	public handleCardPlayByAI(): void {
		if (this.winningBtn.visible) { //直接胡牌
			this.win()
			this.winningBtn.visible = false
			this.passBtn.visible = false
			return;
		}
		if (this.minggangBtn.visible ) { //直接杠
			this.gang('minggang',"杠",this.activeOperateCardNum)
			this.minggangBtn.visible = false
			this.passBtn.visible = false
			return;
		}
		if (this.bugangBtn.visible) { //直接杠
			this.gang('bugang',"杠",this.activeOperateCardNum)
			this.bugangBtn.visible = false
			this.passBtn.visible = false
			return;
		}
		if (this.angangBtn.visible) { //直接杠
			this.gang('angang',"杠",this.activeOperateCardNum)
			this.angangBtn.visible = false
			this.passBtn.visible = false
			return;
		}
		if (this.bumpBtn.visible) { //直接碰
			this.peng()
			this.bumpBtn.visible = false
			this.passBtn.visible = false
			return;
		}
		let permission = this.checkCanOperate()
		if(!permission) return
		// todo 先随机出一张牌，后期增加AI托管功能
		const roomInfo = dataManager.getData("roomInfo");
		const userInfo = dataManager.getData("userInfo");
		const roomId = roomInfo[userInfo?.id]?.roomId;
		const handCards = roomInfo[userInfo?.id]?.handCards;
		const len = handCards?.length;

		const randomIdx = Math.floor(Math.random() * len);
		
		const cardNum = handCards[randomIdx];
		this._socket.sendMessage(JSON.stringify({type: "playCard", data: {roomId, cardNum, userId: userInfo?.id}}))
		this.activeCardNum = cardNum;
		if(this.passBtn.visible)this.passBtn.visible=false
		if(this.bumpBtn.visible)this.bumpBtn.visible=false
		if(this.minggangBtn.visible)this.minggangBtn.visible=false
		if(this.bugangBtn.visible)this.bugangBtn.visible=false
		if(this.angangBtn.visible)this.angangBtn.visible=false
	}
	
	/**
	 * 绘制打出去的牌（限制最多两行）
	 */
	public renderPlayedCards(cardNum: number, playerId: string, roomInfo: any, gameInfo: any): void {
		const k = 1.7; 
		const pW = 44 * k;
		const pH = 48 * k;
		const tableIds = gameInfo?.tableIds;
		const originalPlayerCards = roomInfo[playerId]?.playedCards || []; // 获取服务器所有打出的牌
		const idx = tableIds?.findIndex((o: string)=> o === playerId);
		const vPos = this.viewPos[idx];

		let container = (this as any)[`playedCards${vPos}`];
		if(!container) return;
		container.removeChildren();

		const hCount = 8; // 每行放10张牌
		const maxCards = hCount * 2; // 最多放两行（20张）

		// 💡 核心修改：如果出的牌超过20张，只截取最后20张，把老的顶掉！
		let renderCards = originalPlayerCards;
		if (renderCards.length > maxCards) {
			renderCards = renderCards.slice(-maxCards); 
		}

		renderCards.map((kCard: number, childIdx: number) => {
			let img = new Image(this.getPlayedCardsImageUrl(kCard, vPos));
			img.size(pW, pH);
			
			let rowNum = Math.floor(childIdx / hCount);
			let colNum = childIdx % hCount;

			if (vPos === 0) { // 下
				img.pos(colNum * pW, -rowNum * pH);
			} else if (vPos === 2) { // 上
				img.pos(colNum * pW, rowNum * pH);
			} else if (vPos === 1) { // 右
				img.pos(-rowNum * pW, colNum * (pH * 0.8)); 
			} else if (vPos === 3) { // 左
				img.pos(rowNum * pW, colNum * (pH * 0.8));
			}
			
			container.addChild(img);

			// 出牌指示器（那个小箭头）
			if (kCard === cardNum && childIdx === renderCards.length - 1) {

				// 2. 解析 cardNum，算出对应的女声文件名
				// 数学计算：
				// val 得到 1-9
				// suitIdx 得到 0(wan), 1(tong), 2(tiao)
				let n = cardNum % 50;
				let val = n % 10;
				let suit = n >= 31 && n <= 39 ? "tong" 
						 : n >= 21 && n <= 29 ? "tiao" 
						 : n >= 11 && n <= 19 ? "wan" 
						 : "";
				let voiceUrl = ``;
				if (suit) {
					voiceUrl = `resources/sound/female/g_${val}${suit}.mp3`;
				} else if (n >= 41 && n <= 44) {
					// 风牌 东南西北
					voiceUrl = `resources/sound/female/g_${val}feng.mp3`;
				} else if (n >= 1 && n <= 3) {
					// 三元 中发白
					voiceUrl = `resources/sound/female/g_${val}yuan.mp3`;
				}
				// 4. 播报女声（延迟 100-200ms 效果更真实，像先敲桌子再说话）
				Laya.timer.once(150, this, () => {
					this.playAudio(voiceUrl, false);
				});

				let arrowX = img.x + (pW / 2) - (15 * k);
				let arrowY = img.y - (30 * k);
				this.activePlayedImg.pos(container.x + arrowX, container.y + arrowY);
				this.activePlayedImg.visible = true;
				Laya.timer.clear(this, this.createTweenFn); // 先清掉旧的动画
    			this.createTween(container.y + arrowY);     // 重新开始飘
			}
		});
	}
	
	/**
	 * 创建指示logo漂浮动画
	 * @private
	 */
	private createTween(y: number): void {
		this.createTweenFn(y);
	}
	
	/**
	 * 创建指示logo漂浮动画函数
	 * @param y
	 * @private
	 */
	private createTweenFn(y: number): void{
		Tween.to(this.activePlayedImg, {"y": y - 10}, 400, Laya.Ease.sineInOut, Laya.Handler.create(this, () => {
			Tween.to(this.activePlayedImg, {"y": y + 10}, 400, Laya.Ease.sineInOut)
		}));
	}
	
	/**
	 * todo 绘制桌上未开的牌
	 */
	renderTableCards(): void{}
	
	/**
	 * 暂停游戏
	 */
	private pauseGame(): void{
		Laya.timer.pause()
	}
	/**
	 * 停止游戏
	 */
	public stopGame(): void {
		// 1.状态置为结束
		this._started = false;
		// 2.销毁所有定时器
		Laya.timer.clearAll(this);
		setTimeout(() => {
			this.clearAllCardsUI();
		}, 2000);
		
	}

	private clearAllCardsUI(): void {
        // --- 1. 清理手牌区 ---
        if (this.frontInHand) this.frontInHand.destroyChildren();
        if (this.rightInHand_0) this.rightInHand_0.destroyChildren();
        if (this.oppositeInHand_0) this.oppositeInHand_0.destroyChildren();
        if (this.leftInHand_0) this.leftInHand_0.destroyChildren();

        // --- 2. 清理碰杠牌区 ---
        if (this.pengBox_0) this.pengBox_0.destroyChildren();
        if (this.pengBox_1) this.pengBox_1.destroyChildren();
        if (this.pengBox_2) this.pengBox_2.destroyChildren();
        if (this.pengBox_3) this.pengBox_3.destroyChildren();

        // --- 3. 清理打出的牌区 ---
        if (this.playedCards0) this.playedCards0.destroyChildren();
        if (this.playedCards1) this.playedCards1.destroyChildren();
        if (this.playedCards2) this.playedCards2.destroyChildren();
        if (this.playedCards3) this.playedCards3.destroyChildren();

        // --- 4. 隐藏当前出牌指示标 (箭头/光圈) ---
        if (this.activePlayedImg) {
            this.activePlayedImg.visible = false; 
        }

        // --- 5. 清理内部引用的数组 ---
        this.myCardImgs = [];
    }
	
	/**
	 * 渲染牌桌状态（出牌人指向等）
	 */
	public renderTimeStatus(): void {
		const userInfo = dataManager.getData("userInfo");
		const roomInfo = dataManager.getData("roomInfo");
		const gameInfo = dataManager.getData("gameInfo");
		const tableIds = gameInfo?.tableIds;
		this.playerNum = tableIds?.length;
		const move: number = tableIds.findIndex((o: string) => o == userInfo?.id);
		const optionPos = gameInfo?.optionPos;
		let optionIdx: number = 0;
		optionIdx = optionPos - move >= 0 ? optionPos - move : optionPos - move + this.viewPos.length;
		this.timesArr.map(tmp=>{
			if(optionIdx === tmp){
				// @ts-ignore
				this[`time${tmp}`].visible = true
			} else {
				// @ts-ignore
				this[`time${tmp}`].visible = false
			}
		})
		
		// this.renderCountdownInterval()
		
		this.startTime = Date.now();
		
		
	}
	
	/**
	 * 渲染牌桌中间的倒计时
	 * 每次出牌自定义20秒杠碰胡考虑时间
	 */
	public renderCountdown(): void {
		const gameInfo = dataManager.getData("gameInfo");
		const optionTime = gameInfo?.optionTime;
		const currentTime = Date.now(); // 当前时间
		// 计算已经过去的时间（毫秒）
		const elapsedMillis = currentTime - optionTime;
		// 剩余时间（秒）
		let remainingTime = this.countdownNum - Math.floor(elapsedMillis / 1000);
		if (remainingTime < 0) {
			remainingTime = 0; // 防止剩余时间变成负数
		}
		// 计算倒计时的十位和个位
		let firstDigit = Math.floor(remainingTime / 10);
		let secondDigit = remainingTime % 10;
		const imgUrl1 = `resources/apes/number/${firstDigit}.png`
		const imgUrl2 = `resources/apes/number/${secondDigit}.png`
		this.countdown0.skin = imgUrl1;
		this.countdown1.skin = imgUrl2;
		this.countdown0.visible = true;
		this.countdown1.visible = true;
		if (remainingTime <= 0) {
			this.handleCardPlayByAI();
			Laya.timer.clear(this, this.renderCountdown)
			this.countdown0.visible = false;
			this.countdown1.visible = false;
		}
	}
	
	/**
	 * 倒计时定时器方法
	 */
	public renderCountdownInterval(): void{
		Laya.timer.clear(this, this.renderCountdown);
		Laya.timer.frameLoop(60, this, this.renderCountdown);
	}
	
	private initGameSession(): void {
		const userInfo = dataManager.getData("userInfo");
		const gameInfo = dataManager.getData("gameInfo");

		if (!gameInfo || !gameInfo.tableIds) {
			return;
		}

		const tableIds = gameInfo.tableIds;
		this.playerNum = tableIds.length;

		// 🚨 核心逻辑：算出你在哪，全场怎么排座
		const meIdx: number = tableIds.findIndex((o: string) => o == userInfo?.id);
		this.viewPos = this.getPlayerViewPos(meIdx, tableIds);

		// 状态管理
		this._started = true;
		// console.log("--- 游戏视角与状态初始化完成 ---");
	}

	/**
	 * 已经准备好，开始游戏
	 */
	public readyGameStart(): void {
		this.initGameSession();
		const userInfo = dataManager.getData("userInfo");
		const roomInfo = dataManager.getData("roomInfo");
		const gameInfo = dataManager.getData("gameInfo");
		const remainingNum = gameInfo?.remainingNum;
		const tableIds = gameInfo?.tableIds;
		this.playerNum = tableIds?.length;
		const meIdx: number = tableIds.findIndex((o: string) => o == userInfo?.id);
		this.viewPos = this.getPlayerViewPos(meIdx, tableIds)
		this.renderTimeStatus()
		tableIds.map((o: string, idx: number) => {
			this.renderHandCards(idx, roomInfo[o]?.handCards)	
		})
		// 绘制全部玩家头像
		this.renderAllPlayer(roomInfo);
		this._started = true;
		
		this.remainingLabel.text = remainingNum?.toString();
		this.exitBtn.visible = false;
	}
	
	
	/**
	 * 服务器下发一张牌（摸一张新牌）
	 * @param cardNum
	 * @param playerId
	 */
	deliverCard(cardNum: number, playerId: string): void{
		const userInfo = dataManager.getData("userInfo");
		const gameInfo = dataManager.getData("gameInfo");
		if(userInfo?.id === playerId){  //服务器下发新牌的玩家，需要更新检测，其他人不需要
			this.activeCardNum = cardNum;
		}
		const remainingNum = gameInfo?.remainingNum;
		this.remainingLabel.text = remainingNum?.toString()
	}
	
	/**
	 * 检测我当前状态是否轮到我操作
	 */
	public checkCanOperate(): boolean {
		const userInfo = dataManager.getData("userInfo");
		const gameInfo = dataManager.getData("gameInfo");
		const optionPos = gameInfo?.optionPos;
		const tableIds = gameInfo?.tableIds;
		if (tableIds[optionPos] === userInfo?.id) {
			return true
		} else {
			return false
		}
	}
	
	/**
	 * 检测道可以执行操作（碰杠胡）
	 */
	public checkOperate(operateType: string, playerId: string, cardNum?: number): void{
		this.activeOperateCardNum = cardNum;
		
		const userInfo = dataManager.getData("userInfo");
		if (userInfo?.id !== playerId) return
		if (operateType === "peng") {
			this.bumpBtn.visible = true;
			this.passBtn.visible = true;
		} else if (operateType === "minggang") {
			this.minggangBtn.visible = true;
			this.passBtn.visible = true;
		} else if (operateType === "win") {
			this.winningBtn.visible = true;
			this.passBtn.visible = true;
		} else if (operateType === "bugang") {
			this.bugangBtn.visible = true;
			this.passBtn.visible = true;
		} else if (operateType === "angang") {
			this.angangBtn.visible = true;
			this.passBtn.visible = true; 	   
		} else if (operateType === "huagang") {
			
			this.gang("huagang" , null, cardNum)	   
		}
		
	}
	
	/**
	 * 过
	 * 【不执行任何操作，隐藏 杠/碰 】
	 */
	private pass(): void{
		this.playAudio("按钮", false);
		this.passBtn.visible = false;
		this.bumpBtn.visible = false;
		this.minggangBtn.visible = false;
		this.bugangBtn.visible = false;
		this.angangBtn.visible = false;
	}
	/**
	 * 碰
	 * 【打出2张牌】
	 */
	private peng(): void{
		

		
		const userInfo = dataManager.getData("userInfo");
		const roomInfo = dataManager.getData("roomInfo");
		
		const roomId = roomInfo[userInfo?.id]?.roomId;
		
		this._socket.sendMessage(JSON.stringify({type: "peng", data: {roomId, userId: userInfo?.id, cardNum: this.activeOperateCardNum}}))
		this.bumpBtn.visible = false;
		this.passBtn.visible = false;
		this.playAudio("按钮", false);
		Laya.timer.once(150, this, () => {
			this.playAudio("peng", false)
		});
		Laya.timer.once(150, this, () => {
			this.playAudio("碰",false)
		});
		
	}
	
	/**
	 * 杠
	 * 【打出3张牌】
	 */
	private gang(type: string , audio:string ,cardNum:number): void{
		
		const userInfo = dataManager.getData("userInfo");
		const roomInfo = dataManager.getData("roomInfo");
		const roomId = roomInfo[userInfo?.id]?.roomId;
		const sendCardNum = cardNum;
		
		if (type === "huagang") {
			// 服务器发来什么cardNum就返回什么
			
			this._socket.sendMessage(JSON.stringify({ type: "gang", data: { roomId, userId: userInfo?.id, cardNum: sendCardNum,type: type  } }));
        
		} else if (type === "angang") {
			this.angangBtn.visible = false;
			this.passBtn.visible = false;
			Laya.timer.once(150, this, () => {
				this.playAudio("gang", false);
			});
			this._socket.sendMessage(JSON.stringify({ type: "gang", data: { roomId, userId: userInfo?.id, cardNum: this.activeCardNum,type: type } }));
			this.playAudio("按钮", false);

		} else if (type === "bugang") {
			this.bugangBtn.visible = false;
			this.passBtn.visible = false;
			this.playAudio("按钮", false);
			Laya.timer.once(150, this, () => {
				this.playAudio("gang", false);
			});
			this._socket.sendMessage(JSON.stringify({ type: "gang", data: { roomId, userId: userInfo?.id, cardNum: sendCardNum ,type: type} }));
		}else if (type === "minggang") {
			this.minggangBtn.visible = false;
			this.passBtn.visible = false;
			this._socket.sendMessage(JSON.stringify({ type: "gang", data: { roomId, userId: userInfo?.id, cardNum: this.activeCardNum ,type: type} }));
			this.playAudio("按钮", false);
			Laya.timer.once(150, this, () => {
				this.playAudio("gang", false);
			});
		}

		
		
		if(audio!= null)
			Laya.timer.once(150, this, () => {
				this.playAudio(audio,false)
			});
		
	}
	
	/**
	 * 点击选择胡牌
	 * 【告诉服务端，玩家选择胡牌操作】
	 */
	private win(): void {
		
		const userInfo = dataManager.getData("userInfo");
		const roomInfo = dataManager.getData("roomInfo");
		const roomId = roomInfo[userInfo?.id].roomId;
		this._socket.sendMessage(JSON.stringify({type: "win", data: {roomId, cardNum: this.activeCardNum, userId: userInfo?.id}}))
		this.playAudio("按钮", false);
		Laya.timer.once(150, this, () => {
			this.playAudio("胡",false);
		});
		
		
	}
	
	/**
	 * 胡牌之后的结算
	 * 服务端统一计算
	 */
	public winning(result: any, type: string): void {
		if (!result) return
		if(type === "winning"){
			this.playAnimation();  // 播放胡牌动画
		}
		this.activePlayedImg.visible = false;
		this.settlementDialog.visible = true;
		this.settlementDialog.zOrder = 1000;
		const userInfo = dataManager.getData("userInfo");
		const gameInfo = dataManager.getData("gameInfo");
		const tableIds = gameInfo?.tableIds;
		if (result[userInfo?.id].isFlow) {
			this.status.skin = `resources/apes/settlement/draw.png`
		} else if (result[userInfo?.id].isWinner) {
			this.status.skin = `resources/apes/settlement/win.png`
		} else {
			this.status.skin = `resources/apes/settlement/lost.png`
		}
		tableIds.map((o: string, idx: number) => {
			const info = result[o];
			const cards = info?.cards || [];
			// @ts-ignore	
			const hBox = this[`playerCards${idx}`].getChildByName("HBox");
			if (hBox) hBox.destroyChildren();
			cards.map((c: any, cardIdx: number) => {
				let imgUrl = this.getPlayedCardsImageUrl(c, 0);
				const img = new Image(imgUrl);
				img.scale(0.8,0.8);
						
				hBox.addChild(img)
			})
			// @ts-ignore
			const txt = this[`playerCards${idx}`].getChildByName("score")
			txt.text = info?.score >= 0 ? '+' + info?.score : info?.score?.toString();
		})
		this.winningBtn.visible = false;
		this.passBtn.visible = false;
		// this.stopGame();
	}
	
	/**
	 * 返回大厅
	 */
	backToHall(): void{
		this.playAudio("按钮", false);
		// 调用服务端
		const userInfo = dataManager.getData('userInfo');
		let http = new HttpHelper();
		http.post("/room/quitRoom", {userId: userInfo?.id, roomId: userInfo?.roomId}, this.backToHallCallBack.bind(this));
		
	}

	backToHallCallBack(data: any):void {
		
		if(data?.errCode === 0) {
			Laya.Scene.open("Hall.ls");}   
        else{
		// 打开场景
		console.log("退出失败:", data?.errMsg);}
		

	}
	
	/**
	 * 播放动画
	 */
	playAnimation(): void{

		const atlasPath = "resources/animations/win.atlas";
		Laya.loader.load(atlasPath, Laya.Handler.create(this, () => {
            
            // 2. 只要进到这里，说明图集 100% 已经在内存里准备就绪了！
            let ani: Laya.Animation = new Laya.Animation();
            ani.pos(1175, 440); 
            ani.scale(2, 2);
            ani.zOrder = 1007;
            ani.interval = 50; 
            
            this.owner.addChild(ani); 

            // 3. 直接喂给动画节点并播放 (此时因为已经在内存里，瞬间就能播)
            ani.loadAtlas(atlasPath);
            ani.play(0, false); 
            
            // 4. 监听播放完成并销毁
            ani.on(Laya.Event.COMPLETE, this, () => {
                ani.destroy();
            });
            
        }), null, Laya.Loader.ATLAS);
		
	}
	
	/**
	 * 播放音频
	 */
	playAudio(type: string, isMusic:boolean): void {
		if (isMusic && Laya.SoundManager.musicMuted) {
            return;
        }
		if (!isMusic && Laya.SoundManager.soundMuted) {
            return;
        }
		let sound = new Laya.SoundNode();
			// 添加到舞台
		sound.source = this.getAudioRes(type) || type;
		sound.loop = 0;
		sound.autoPlay = true;
		sound.isMusic = isMusic;
		sound.play(isMusic ? 0 : 1, Laya.Handler.create(this, this.playAudioCb, [sound]));
        
        this.owner.addChild(sound);

		if (isMusic) {
            this.currentBgmNode = sound;
        }
		
	}
	
	/**
	 * 获取音效资源
	 */
	getAudioRes(type: string): string {
		let audioUrl: string;
		if (type === "背景音乐") {
			audioUrl = `resources/sound/BGM_Playing001.mp3`;
		} else if (type === "牌点击") {
			audioUrl = `resources/sound/牌点击音效.mp3`;
		} else if (type === "出牌") {
			audioUrl = `resources/sound/出牌音效.mp3`;
		} else if (type === "碰") {
			audioUrl = `resources/sound/碰音效.mp3`;
		} else if (type === "杠") {
			audioUrl = `resources/sound/杠音效.mp3`;
		} else if (type === "胡") {
			audioUrl = `resources/sound/胡音效.mp3`;
		} else if (type === "按钮") {
			audioUrl = `resources/sound/SE_Btn3.wav`;
		} else if (type === "peng") {
			audioUrl = `resources/sound/peng.mp3`;
		} else if (type === "gang") {
			audioUrl = `resources/sound/g_gang.mp3`;
		}
		

		return audioUrl
	}
	/**
	 * 播放音频handle回调
	 * @param sound
	 */
	playAudioCb(sound: Laya.SoundNode): void {
		sound.destroy();
	}
	
	
	//每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
	onUpdate(): void {
		let now = Date.now();
		if (now - this.startTime > this.timeInterval && this._started) {
			this.startTime = now;
			this.renderCountdown()
		}
	}
}
