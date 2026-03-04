export default class Header extends webcore.component.builder {

    static tag = 'app-header';

    create(){
        this.template(
`<header>
    <div>
        <button type="button" title="返回"><i></i><span class="back"></span></button>
    </div>
    <div>
        <span class="icon"><img alt="❖"></span>
        <span class="title"></span>
    </div>
</header>`
        )
        .styles('/components/header/header.css')
        .inject(['event']);
    }

    onCreated(){
        this.element = {
            back: this.querySelector('.back'),
            icon: this.querySelector('img'),
            title: this.querySelector('.title'),
        };

        this.element.back.textContent = this.dataset.back;
        this.element.icon.src = this.dataset.icon;
        this.element.title.textContent = this.dataset.title;

        for (const attr of this.getAttributeNames()){this.removeAttribute(attr)}

        this.services.event.select(
            this.querySelector('button')).click(()=>{history.back()}).bind();
    }
}
