export default class Infor extends webcore.component.builder {
    static tag = 'song-infor';

    create(){
        this.template(
`<header>
    <button type="button" title="返回"><i></i><span class="back"></span></button>
</header>
<footer>
    <section>
        <h3><span class="title"></span></h3>
        <p></p>
    </section>
</footer>`
        )
        .styles('/components/infor/infor.css')
        .mode('closed')
        .inject(['event']);
    }

    onCreated(){
        this.element = {
            back: this.querySelector('.back'),
            title: this.querySelector('.title'),
            desc: this.querySelector('p')
        };

        this.services.event.select(
            this.querySelector('button')).click(()=>{history.back()}).bind();
    }

    render(infor){

        this.element.back.textContent = infor.back;
        this.element.title.textContent = infor.title;
        this.element.desc.innerHTML = infor.desc;

    }
}
