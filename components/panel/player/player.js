export default class PlayerPanel extends webcore.component.builder {

    static tag = 'app-player';

    create(){
        // 配置组件 html 和 css 等
        this.styles('/components/panel/player/player.css')
        .template('/components/panel/player/player.html')
        .mode('closed')
        .inject(['event','state','reactive']);


        // 创建自定义元素
        Object.sealProp(this, "history", []);
        Object.sealProp(this, "current", null);
        Object.freezeProp(this, "audio", new Audio());
    }

    onCreated(){
        const { event, state, reactive } = this.services;

        // 时间格式化
        const format = (t)=>{
            if (!isNaN(t) && t!=0){
                const f = Math.floor(t);
                const m = Math.floor(f/60);
                const s = f % 60;
                if (s<10) {return m+':0'+s}else{return m+':'+s};
            } else {
                return '0:00';
            }
        }
        // 进度条循环器
        const circulator = Object.pure({
            ref: null,
            audio: this.audio,
            progress: this.querySelector('progress'),
            currenTime: this.querySelector('.current-time'),
            endTime: this.querySelector('.end-time'),
            run: ()=>{
                if (circulator.audio.paused){
                    cancelAnimationFrame(circulator.ref);
                } else {
                    const time = circulator.audio.currentTime;
                    circulator.progress.value = Math.floor(time*1000000);
                    circulator.currenTime.textContent = format(time);
                    requestAnimationFrame(circulator.run);
                }
            }
        },false);

        this.audio.ondurationchange = ()=>{
            circulator.progress.max = circulator.audio.duration*1000000;
            circulator.currenTime.textContent = format(0);
            circulator.endTime.textContent = format(circulator.audio.duration);
        }
        Object.freezeProp(this, "circulator", circulator);


        this.element = {
            backg: this.querySelector('.backg-img'),
            cover: this.querySelector('.cover-img'),
            down: this.querySelector('.down'),
            mv: this.querySelector('.mv'),
            progress: circulator.progress,
            title: reactive.element(this.querySelector("h2")),
            artist: reactive.element(this.querySelector(".artist")),
            album: reactive.element(this.querySelector(".album")),
            order: reactive.element(this.querySelector(".order")),
            count: reactive.element(this.querySelector(".count")),
            infor: this.querySelector('.infor')
        };

        this.icon = {
            play: this.querySelector('.play-icon'),
            pause: this.querySelector('.pause-icon'),
            listloop: this.querySelector('.list-icon'),
            selfloop: this.querySelector('.loop-icon'),
            orderplay: this.querySelector('.order-icon'),
            randomplay: this.querySelector('.random-icon'),
        }

        this.audio.preload = 'none';
        this.audio.autoplay = false;

        // 主播放面板状态
        this.state.opened = reactive.store(!this.classList.contains("close"));
        this.state.opened.onchange = (val)=>{
            if (val){
                event.emit('video','close');
                event.emit('playlist', 'close');
                event.emit('footer', 'close');
                this.element.infor.classList.remove('hidden');
                this.classList.remove('close')
            } else {
                event.emit('playlist', 'close');
                event.emit('footer', 'open');
                this.classList.add('close')
            }
        };
        state.set("player", this.state.opened);

        // mv 按钮状态
        this.state.mv = reactive.store(false);
        this.state.mv.onchange = (val)=>{
            if (val){
                this.element.mv.classList.remove('close')
            } else {
                this.element.mv.classList.add('close')
            }
        }

        // 歌曲播放状态（改变切换按钮图标）
        this.state.playing = reactive.store(false);
        this.state.playing.onchange = (val)=>{
            if (val) {
                event.emit('video', 'close');
                this.icon.pause.style.display = "none";
                this.icon.play.style.display = "inline";
                event.emit('footer', 'play');
                event.emit('lyrics', 'run');
                this.run()
            } else {
                this.icon.play.style.display = "none";
                this.icon.pause.style.display = "inline";
                event.emit('footer', 'pause');
                event.emit('lyrics', 'stop');
                this.stop();
            }
        };
        // 保存到全局状态
        state.set("playing", this.state.playing);

        // 循环状态
        const changeStyle = (target, state)=>{
            if (state){
                target.setAttribute('fill','#ffffff')
            } else {
                target.setAttribute('fill','#B8B8B8')
            }
        }
        this.state.listloop = reactive.store(false);
        this.state.listloop.onchange = (val)=>{
            changeStyle(this.icon.listloop, val)
        }
        this.state.selfloop = reactive.store(false);
        this.state.selfloop.onchange = (val)=>{
            if (val){
                this.audio.loop = true;
            } else {
                this.audio.loop = false;
            }
            changeStyle(this.icon.selfloop, val)
        }
        this.state.orderplay = reactive.store(true);
        this.state.orderplay.onchange = (val)=>{
            changeStyle(this.icon.orderplay, val)
        }
        this.state.randomplay = reactive.store(false);
        this.state.randomplay.onchange = (val)=>{
            changeStyle(this.icon.randomplay, val)
        }

        event.emit('lyrics', 'start', this.audio);
    }

    // 绑定事件
    onBeforeMount(){
        const event = this.service('event');

        // 给 audio 元素绑定播放暂停事件
        this.audio.onplay = ()=>{this.state.playing.value = true};
        this.audio.onpause = ()=>{this.state.playing.value = false};
        this.audio.onerror = ()=>{this.next()};
        this.audio.onended = ()=>{this.next()};
        // 打开媒体库
        event.select(this.querySelector('.media')).click(
            ()=>{this.close()}
        ).bind();
        // 点击专辑图片关闭面板
        event.select(this.querySelector('.cover > div')).click(
            ()=>{this.close()}
        ).bind();
        // 上一首
        event.select(this.querySelector('.last')).click(
            ()=>{this.last()}
        ).bind();
        // 播放、暂停
        event.select(this.querySelector('.toggle')).click(
            ()=>{this.toggle();}
        ).bind();
        // 下一首
        event.select(this.querySelector('.next')).click(
            ()=>{this.next()}
        ).bind();
        // 播放列表
        event.select(this.querySelector('.list')).click(
            ()=>{event.emit("playlist", "toggle")}
        ).bind();


        // 打开歌词面板
        event.select(this.querySelector('.list-order')).click(
            ()=>{
                if (event.emit("lyrics", "toggle")){
                    this.element.infor.classList.add('hidden')
                } else {
                    this.element.infor.classList.remove('hidden')
                }
            }
        ).bind();

        // 打开 mv 面板
        event.select(this.querySelector('.mv')).click(
            (ev)=>{
                if (event.emit("video", "toggle")) {
                    ev.currentTarget.classList.remove('stop')
                } else {
                    ev.currentTarget.classList.add('stop')
                }
            }
        ).bind();

        // 进度条
        event.select(this.element.progress).click(
            (el)=>{
                const rect = this.element.progress.getBoundingClientRect();
                if (!isNaN(this.audio.duration)) {
                    this.audio.currentTime = Math.floor(
                        (Math.floor(this.audio.duration)/rect.width)*(el.clientX - rect.left)
                    );
                }
            }
        ).bind();

        // 播放模式切换
        // 列表循环
        event.select(this.querySelector('.listloop')).click(
            ()=>{
                this.state.selfloop.value = false;
                this.state.orderplay.value = false;
                this.state.randomplay.value = false;
                this.state.listloop.value = true;
            }
        ).bind();
        // 单曲循环
        event.select(this.querySelector('.selfloop')).click(
            ()=>{
                this.state.listloop.value = false;
                this.state.orderplay.value = false;
                this.state.randomplay.value = false;
                this.state.selfloop.value = true;
            }
        ).bind();
        // 顺序播放
        event.select(this.querySelector('.orderplay')).click(
            ()=>{
                this.state.listloop.value = false;
                this.state.selfloop.value = false;
                this.state.randomplay.value = false;
                this.state.orderplay.value = true;
            }
        ).bind();
        // 随机播放
        event.select(this.querySelector('.randomplay')).click(
            ()=>{
                this.state.listloop.value = false;
                this.state.selfloop.value = false;
                this.state.orderplay.value = false;
                this.state.randomplay.value = true;
            }
        ).bind();

        // 暴露接口
        event.expose("player", {
            audio: ()=>this.audio,
            play: song=>this.play(song),
            pause: ()=>this.pause(),
            toggle: ()=>this.toggle(),
            open: ()=>this.open(),
            close: ()=>this.close(),
            change: (song)=>this.change(song)
        });
    }


    // 组件方法
    // 运行
    run(){
        this.circulator.ref = requestAnimationFrame(this.circulator.run)
    }
    // 停止进度条
    stop(){
        cancelAnimationFrame(this.circulator.ref);
    }
    // 播放上一首
    last(){
        const song = this.history.pop();
        if (song){
            if (this.state.playing.value){
                this.play(song, false);
            } else {
                this.change(song, false);
            }
            return true;
        }
        return false;
    }
    // 播放下一首
    next(){
        if (this.state.selfloop.value){return false;}
        let order = 0;
        if (this.current){order = this.current.order}
        const count = this.services.event.emit('playlist', 'count');
        if (this.state.randomplay.value){
            order = top.webcore.utility.getRandomInteger(count, order);
        } else if (order >= count){
            if (this.state.orderplay.value){return false;}
            if (this.state.listloop.value){order = 0;}
        }
        const song = this.services.event.emit('playlist', 'select', order+1);
        if (song){this.change(song)}
    }
    // 打开面板
    open(){
        this.state.opened.value = true;
    }
    // 关闭面板
    close(){
        this.state.opened.value = false;
    }
    // 切歌
    async change(song, history = true) {
        if (Object.isObject(song)) {
            if (history && this.current) {this.history.push(this.current)}
            this.current = song;
            this.audio.src = `${top.webcore.getConfig('song')}/${encodeURIComponent(song.folder)}/${encodeURIComponent(song.name)}.mp3`;
            const cover = `${top.webcore.getConfig('cover')}/album/${song.cover}.jpg`;
            this.element.backg.style.backgroundImage = `url(${cover})`;
            this.element.cover.src = cover;
            this.state.mv.value = song.mv;
            this.element.order.value = song.order;
            this.element.count.value = song.count;
            this.element.artist.value = song.artist;
            this.element.title.value = song.title;
            this.element.album.value = song.album;
            this.services.event.emit('footer', 'change', song);
            this.services.event.emit('lyrics','change', song);
            this.services.event.emit('video','change', song)
        }
    }
    // 播放歌曲
    play(song, history) {
        if (this.audio.preload === "none") {
            this.audio.preload = 'auto';
        }
        this.change(song, history);

        if (this.audio.autoplay === false) {
            this.audio.autoplay = true;
        }
        this.audio.play();

        return true;
    }
    // 暂停歌曲
    pause(){
        this.audio.pause()
    }
    // 切换播放或暂停
    toggle(){
        if (this.audio.paused){
            return this.play()
        } else {
            return this.pause()
        }
    }
}
