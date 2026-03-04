export default class LyricsPanel extends webcore.component.builder {

    static tag = 'app-lyrics';

    create(){
        this.styles('/components/panel/lyrics/lyrics.css')
        .template('<div class="head"></div><div class="body"></div>')
        .mode('closed')
        .inject(['event', 'state', 'reactive']);

        Object.freezeProp(this, "default", document.createElement('div'));
        this.default.innerHTML = "<p>\u6682\u65e0\u6b4c\u8bcd</p>";


        Object.sealProp(this, 'timer', null);
        Object.sealProp(this, 'current', null);
        Object.sealProp(this, 'times', null);
        Object.sealProp(this, 'value', null);
        Object.sealProp(this, 'audio', null);
        Object.freezeProp(this, 'scrollOption', Object.pure({behavior: 'smooth', block: 'center'}, false));
    }

    onCreated(){
        const { event, state, reactive } = this.services;

        // 歌曲渲染区域
        this.element = {
            body: this.querySelector('.body')
        };

        // 歌词面板打开状态
        this.state.opened = reactive.store(!this.classList.contains("close"));
        this.state.opened.onchange = (val)=>{
            if (val){
                if (top.webcore.layout.portrait){
                    event.emit('footer', 'open');
                }
                this.classList.remove('close');
                this.run()
            } else {
                this.stop();
                this.classList.add('close')
            }
        }
        // 保存到全局状态
        state.set("lyrics", this.state.opened);




        // 暴露接口
        event.expose("lyrics", {
            open: ()=>this.open(),
            close: ()=>this.close(),
            toggle: ()=>this.toggle(),
            change: (song)=>this.change(song),
            run: ()=>this.run(),
            stop: ()=>this.stop(),
            start: (audio)=>this.start(audio)
        });
    }

    // 面板开关
    has(){return this.value !== null;}
    open(){return this.state.opened.value = true}
    close(){return this.state.opened.value = false}
    toggle(){return this.state.opened.value = !this.state.opened.value}
    start(audio){this.audio = audio}

    // 歌词滚动
    run(){
        if (this.state.opened.value && this.value !== null && this.audio.paused === false){
            const hight = this.element.body.scrollHeight - this.element.body.clientHeight;
            const dur = Math.floor(this.audio.duration);
            if (this.times === null){
                this.timer = setInterval(()=>{
                    this.element.body.scrollTop = Math.floor((Math.floor(this.audio.currentTime)/dur)*hight);
                }, 4000);
            } else {
                this.timer = setInterval(()=>{
                    const index = this.times[Math.floor(this.audio.currentTime)];
                    if (index){
                        if (this.current !== null) {this.current.classList.remove('play')}
                        this.current = this.value.children[index];
                        this.current.classList.add('play');
                        this.current.scrollIntoView(this.scrollOption);
                    }
                }, 500);
            }
        }
    }
    stop(){clearInterval(this.timer)}

    // 歌曲切换
    clear(){
        this.value = null;
        this.times = null;
        this.element.body.replaceChildren(this.default)
    }
    async change(song){
        this.stop();
        this.clear();

        if (Object.isObject(song)){
            const url = top.webcore.getConfig('lyrics') +
                `/${
                    encodeURIComponent(song.folder)
                }/${
                    encodeURIComponent(song.artist.replaceAll(',','_'))
                }-${
                    encodeURIComponent(song.title)
                }.lrc`;
            let data = await URL.loader(url);
            data = data.trim();
            if (!data) {return false;}
            let o = data.match(/\[offset:[^\]]*\]/);
            if (o){
                o = Math.round(Number(o[0].substring(8,o[0].length-1))/1000)
            } else {
                o = 0
            }
            const index = data.indexOf("[00:");
            data = data.substring(index).replace(/(\r\n|\r|\n|↵)/g,'<br>').replace(/\s+\-\s+/,' - ');
            const a = data.split('<br>');
            const doc = document.createElement('div');
            const l = a.length-1;
            let t;
            let p;
            if (index > -1){
                let s = 0;
                for (let i = 0;i <= l;i ++){
                    const m = a[i].match(/\[[^\]]*\]/);
                    if (m) {const t=m[0];
                        s = Math.round((Number(t.substring(1,3))*60)+Number(
                            t.substring(4,6))+(Number(t.substring(7,9))*0.01)-o-0.5);
                        if (s <= 0){s = 0};
                    }
                    t = a[i].replace(/\[[^\]]*\]/g,'').trim();
                    p = document.createElement("p");
                    if (m){p.dataset.sec=s};
                    p.textContent = t;
                    doc.appendChild(p);
                }
                const times = new Array(s);
                times.fill(null);
                for (let i = 0;i <= l;i ++){
                    if (doc.children[i].hasAttribute('data-sec')){
                        times[Number(doc.children[i].dataset.sec)] = i;
                        doc.children[i].removeAttribute('data-sec');
                    }
                }
                this.times = times;
                s = null;
            } else {
                for (let i = 0;i <= l;i ++){
                    t = a[i].trim();
                    p = document.createElement("p");
                    p.textContent = t;
                    doc.appendChild(p);
                }
            }
            data = null;
            t = null;
            p = null;
            this.value = doc;
            this.element.body.replaceChildren(doc);
        }
    }

}
