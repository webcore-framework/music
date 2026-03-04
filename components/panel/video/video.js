export default class VideoPanel extends webcore.component.builder {

    static tag = 'app-video';

    create(){
        this.styles('/components/panel/video/video.css')
        .template('<main><video controls="" preload="none" controlslist="nodownload" draggable="false"></video></main>')
        .mode('closed')
        .inject(['event', 'state', 'reactive'])
    }

    onCreated(){
        const { event, state, reactive } = this.services;

        this.element = {
            video: this.querySelector('video')
        };

        // MV 面板打开状态
        this.state.opened = reactive.store(!this.classList.contains('close'))
        this.state.opened.onchange = (val)=>{
            if (val){
                this.classList.remove('close');
                event.emit('player','pause');
                this.element.video.play()
            } else {
                this.element.video.pause();
                this.classList.add('close');
            }
        };
        // 保存面板状态到全局
        state.set('video', this.state.opened);

        // 暴露接口
        event.expose('video',{
            open: ()=>this.open(),
            close: ()=>this.close(),
            play: ()=>this.play(),
            pause: ()=>this.pause(),
            toggle: ()=>this.toggle(),
            change: (song)=>this.change(song)
        })
    }

    play(){
        this.element.video.play()
    }
    pause(){
        this.element.video.pause()
    }
    open(){
        return this.state.opened.value = true
    }
    close(){
        return this.state.opened.value = false
    }
    toggle(){
        return this.state.opened.value = !this.state.opened.value
    }
    change(song){
        this.element.video.removeAttribute('src');
        if (Object.isObject(song) && song.mv){
            this.element.video.src = `${top.webcore.getConfig('video')
                }/${
                    encodeURIComponent(song.folder)
                }/${
                    encodeURIComponent(song.name)
                }.mp4`;
            return true;
        }
        return false;
    }
}
