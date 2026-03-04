export default class Carousel extends webcore.component.builder {
    static tag = 'song-carousel';

    create(){
        this.styles('/components/carousel/carousel.css')
        .template('')
    }

    render(data){
        if (!Array.isArray(data.poster)){return false}
        const ol =  document.createElement('ol');
        for (const cover of data.poster){
            const li = Element.createAll({
                tag: 'li',
                children: [
                    {
                        tag: 'img',
                        attrs: {
                            src: `${top.webcore.getConfig('cover')}/${data.source}/${cover}.jpg`,
                            alt: "."
                        }
                    }
                ]
            });
            ol.append(li);
        }
        this.root.append(ol);
    }
}
