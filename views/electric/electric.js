export default class ElectricView extends webcore.component.builder {

    static tag = 'view-electric';

    create(){
        this.styles(':host{display:block}.root{position:relative}')
        .template('/views/electric/electric.html')
        .mode('closed')
        .inject(['http']);
    }

    async onCreated(){
        this.element = {
            main: this.querySelector('app-list'),
            details: this.querySelector('details'),
        };

        const http = this.services.http;
        this.api = http.create({
            url: '/api/sort/electric',
            baseUrl: 'http://chinbeker.picp.vip:5161',
            cache: 7200
        });
        const res = await this.api.get();
        if (res.success){this.render(res.data);}
    }

    render(data){
        if (!Object.isObject(data)){return false;}

        const config = [
            {
                summary: "专辑",
                path: "sort",
                id: "sortId",
                image: "album",
                cover: "cover",
                title: "name",
                list: data.albums
            },
            {
                summary: "风格",
                path: "sort",
                id: "sortId",
                image: "album",
                cover: "cover",
                title: "name",
                list: data.styles
            },
            {
                summary: "声音",
                path: "sing",
                id: "sortId",
                image: "album",
                cover: "cover",
                title: "name",
                list: data.sounds
            },
            {
                summary: "歌手",
                path: "artist",
                id: "artistId",
                image: "artist",
                cover: "avatar",
                title: "artistName",
                list: data.artists
            },
        ];

        this.element.main.render(config);
        return false;
    }
}
