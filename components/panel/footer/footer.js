export default class FooterPanel extends webcore.component.builder {
    static tag = 'app-footer';

    create(){
        this.template('/components/panel/footer/footer.html')
        .styles('/components/panel/footer/footer.css')
        .mode("closed")
        .inject(['event', 'state', 'reactive'])
    }

    // 组件逻辑
    onCreated(){
        const { event, state, reactive } = this.services;
        this.element = {
            cover: this.querySelector('.cover'),
            title: reactive.element(this.querySelector('.title')),
            artist: reactive.element(this.querySelector('.artist')),
            album: reactive.element(this.querySelector('.album')),
        }

        this.icon = {
            play: this.querySelector('.play'),
            pause: this.querySelector('.pause'),
        }

        // 底部面板状态
        this.state.opened = reactive.store(!this.classList.contains("close"));
        this.state.opened.onchange = (val)=>{
            if (val){
                event.emit('video','close');
                if (top.webcore.layout.landscape){
                    event.emit('lyrics', 'close');
                }
                this.classList.remove('close')
            } else {
                if (top.webcore.layout.portrait){
                    event.emit('lyrics', 'close');
                }
                this.classList.add('close')
            }
        };

        // 保存到全局状态
        state.set("footer", this.state.opened);
        this.state.lyrics = state.get('lyrics');

        // 从全局状态获取歌曲播放暂停状态，保存到本组件
        this.state.playing = state.get("playing");
    }


    onBeforeMount(){
        const event = this.service('event');

        // 点击专辑图打开主播放页面
        event.select(this.querySelector('.image')).click(
            ()=>{event.emit("player", "open")}
        ).bind();

        // 播放暂停按钮
        event.select(this.querySelector('.play-pause')).click(
            ()=>{this.toggle()}
        ).bind();

        // 播放列表按钮
        event.select(this.querySelector('.playlist')).click(
            ()=>{event.emit("playlist", "toggle")}
        ).bind();

        // 歌词面板打开时，横竖屏切换时，底部面板在横屏隐藏，竖屏显示
        top.webcore.layout.orientation.change.add(
            ()=>{
                if (this.state.lyrics.value){
                    if (top.webcore.layout.landscape){
                        this.classList.add('close')
                    } else {
                        this.classList.remove('close')
                    }
                }
            }
        );

        // 暴露接口
        event.expose("footer", {
            open: ()=>this.open(),
            close: ()=>this.close(),
            play: ()=>this.play(),
            pause: ()=>this.pause(),
            change: song=>this.change(song),
        })
    }

    // 自定义方法
    open(){
        this.state.opened.value = true
    }
    close(){
        this.state.opened.value = false
    }
    change(song){
        if (Object.isObject(song)){
            this.element.cover.src = `${top.webcore.getConfig('cover')}/album/${song.cover}.jpg`;
            this.element.title.value = song.title;
            this.element.artist.value = song.artist;
            this.element.album.value = song.album;
        }
        return true;
    }
    play(){
        this.icon.pause.style.display = "none";
        this.icon.play.style.display = "inline";
        return true;
    }
    pause(){
        this.icon.play.style.display = "none";
        this.icon.pause.style.display = "inline";
        return false;
    }
    toggle(){
        return this.services.event.emit('player', 'toggle')
    }
}
