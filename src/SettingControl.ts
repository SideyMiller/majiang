
const {regClass, property} = Laya;
@regClass()
export default class SettingControl extends Laya.Script {
    // 记得在 Laya 编辑器里把你的声音开关按钮拖给这个变量
    /** @prop {name:soundBtn, tips:"声音按钮", type:Node}*/
    @property({type: Laya.Image})
    public soundBtn: Laya.Image;
    @property({type: Laya.Image})
    public musicBtn: Laya.Image;
    @property({type: Laya.Image})
    public closeBtn: Laya.Image; 

    // 每次这个面板被打开（实例化）时，自动执行
    onEnable(): void {
        // 1. 读本地缓存。Laya.LocalStorage 存的都是字符串。
        // 如果本地存的是 "1"，说明静音了；否则就是没静音（没存过也默认不静音）
        Laya.SoundManager.soundMuted = Laya.LocalStorage.getItem("Game_Sound_IsMuted") === "1";
        Laya.SoundManager.musicMuted = Laya.LocalStorage.getItem("Game_Music_IsMuted") === "1";



        // 3. 根据状态，刷新按钮的贴图
        this.soundBtn.skin = Laya.SoundManager.soundMuted? "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@开启提示音按钮" : "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@关闭提示音";
        this.musicBtn.skin = Laya.SoundManager.musicMuted? "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@开启音乐按钮" : "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@关闭音乐";

        // 4. 绑定点击事件
        this.soundBtn.on(Laya.Event.CLICK, this, this.onToggleSound);
        this.musicBtn.on(Laya.Event.CLICK, this, this.onToggleMusic);
        
        // 假设你还有个关闭按钮，绑个关闭事件
        this.closeBtn.on(Laya.Event.CLICK, this, () => { 
            this.playAudio("resources/sound/SE_Btn3.wav", false);
            (this.owner as Laya.Sprite).visible = false; 
        });
    }

    // 点击切换声音
    onToggleSound(): void {
        this.playAudio("resources/sound/SE_Btn3.wav", false);
        // 1. 引擎静音状态取反
        Laya.SoundManager.soundMuted = !Laya.SoundManager.soundMuted;

        // 2. 【核心】把最新状态死死钉在本地缓存里！
        // 这样不仅跨场景同步了，连玩家杀掉微信杀掉游戏，下次进来依然记得他的设置！
        Laya.LocalStorage.setItem("Game_Sound_IsMuted", Laya.SoundManager.soundMuted ? "1" : "0");

        this.soundBtn.skin = Laya.SoundManager.soundMuted? "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@开启提示音按钮" : "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@关闭提示音";
    }

    // 点击切换声音
    onToggleMusic(): void {
        // 1. 引擎静音状态取反
        this.playAudio("resources/sound/SE_Btn3.wav", false);
        Laya.SoundManager.musicMuted = !Laya.SoundManager.musicMuted;

        // 2. 【核心】把最新状态死死钉在本地缓存里！
        // 这样不仅跨场景同步了，连玩家杀掉微信杀掉游戏，下次进来依然记得他的设置！
        Laya.LocalStorage.setItem("Game_Music_IsMuted", Laya.SoundManager.musicMuted ? "1" : "0");

        this.musicBtn.skin = Laya.SoundManager.musicMuted? "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@开启音乐按钮" : "5e95be6b-617c-4f21-9f90-3d37e3a4f0d5@关闭音乐";
        
        Laya.stage.event("MUSIC_STATE_CHANGED", Laya.SoundManager.musicMuted);
    }
    playAudio(type: string, isMusic: boolean): void {
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
	}
	playAudioCb(sound: Laya.SoundNode): void {
	
		sound.destroy();
	}

    
}