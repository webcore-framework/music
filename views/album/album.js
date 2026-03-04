export default class AlbumView extends webcore.component.builder {

    static tag = 'view-album';

    create(){
        this.template('/views/album/album.html')
        .styles(':host{display:block}.root{position:relative}')
        .mode('closed')
        .inject(['http'])
    }

    async onCreated(){
        this.main = this.querySelector('app-list');

        const http = this.services.http;

        this.api = http.create({
            url: '/api/album',
            baseUrl: 'http://chinbeker.picp.vip:5161',
            cache: 7200
        });
        const res = await this.api.get();
        if (res.success){this.render(res.data)}
    }

    render(data){
        if (!Object.isObject(data)){return false;}

        const sort = [
            {
                summary: "合集",
                path: "collect",
                id: "collectId",
                image: "album",
                cover: "cover",
                title: "title",
                list: data.collects
            },
            {
                summary: "专辑",
                path: "album",
                id: "albumId",
                image: "album",
                cover: "cover",
                title: "albumName",
                list: data.albums
            },
        ];

        this.main.render(sort)

        return false;
    }
}
