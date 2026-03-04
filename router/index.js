import HomeView from "../views/home/home.js";
import StyleView from "../views/style/style.js";
import ArtistView from "../views/artist/artist.js";
import AlbumView from "../views/album/album.js";
import FavoriteView from "../views/favorite/favorite.js";

const router = {

    base: "/",
    mode: "hash",

    routes: [
        {
            path: "/",
            redirect: "/home",
        },
        {
            path: "/home",
            name: "Home",
            cache: true,
            component: HomeView,
            meta: {title: "首页"},
        },

        // 媒体库
        {
            path: "/style",
            name: "Style",
            cache: true,
            component: StyleView,
            meta: {title: "所有歌曲"}
        },
        {
            path: "/artist",
            name: "Artist",
            cache: true,
            component: ArtistView,
            meta: {title: "艺术家"}
        },
        {
            path: "/album",
            name: "Album",
            cache: true,
            component: AlbumView,
            meta: {title: "专辑"}
        },
        {
            path: "/favorite",
            name: "Favorite",
            cache: true,
            component: FavoriteView,
            meta: {title: "收藏"}
        },

        // 分类
        {
            path: "/chinese",
            name: "Chinese",
            cache: true,
            component: "/views/chinese/chinese.js",
            meta: {title: "华语歌曲"}
        },
        {
            path: "/cantonese",
            name: "Cantonese",
            cache: true,
            component: "/views/cantonese/cantonese.js",
            meta: {title: "粤语歌曲"}
        },
        {
            path: "/english",
            name: "English",
            cache: true,
            component: "/views/english/english.js",
            meta: {title: "英语歌曲"}
        },
        {
            path: "/electric",
            name: "Electric",
            cache: true,
            component: "/views/electric/electric.js",
            meta: {title: "电音歌曲"}
        },
        {
            path: "/classic",
            name: "Classic",
            cache: true,
            component: "/views/classic/classic.js",
            meta: {title: "经典老歌"}
        },
        {
            path: "/national",
            name: "National",
            cache: true,
            component: "/views/national/national.js",
            meta: {title: "民族歌曲"}
        },
        {
            path: "/country",
            name: "Country",
            cache: true,
            component: "/views/country/country.js",
            meta: {title: "祖国歌曲"}
        },
        {
            path: "/soundtrack",
            name: "Soundtrack",
            cache: true,
            component: "/views/soundtrack/soundtrack.js",
            meta: {title: "纯音乐"}
        },
        {
            path: "/songs",
            name: "Songs",
            component: "/views/songs/songs.js",
            meta: {title: "歌曲列表"},
        }

    ]
}

export default router;
