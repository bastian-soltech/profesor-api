// for streaming
// https://api.ytbvideoly.com/share/streaming?uk=4401094499391&shareid=2807324453&sign=9d06150a741b16b2da92bf646e749b263222af63&jsToken=ewre&type=M3U8_FLV_264_480&fid=37976682331932&esl=1&play_from=4khot_b&isplayer=1&ehps=1&clienttype=1&app_id=250528&web=1&channel=dubox&timestamp=177375439898989410

export async function GetHotMovie(){
const data = await fetch('https://api.ytbvideoly.com/api/resconsume/hotlist?res_type=1&page=1&count=10&lang=PH&from_channel=11&hot_order_type=plays_pv&source_domain=www.4khotvideo.com',{
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Origin': 'https://www.4khotvideo.com',
        'Referer': 'https://www.4khotvideo.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Sec-GPC': '1',
        'TE': 'trailers'
    }
})
const json = await data.json()
// console.log(json.data.detail[1])
return json

}

export async function GetDetailMovie(enid) {
    const data = await fetch(`https://api.ytbvideoly.com/api/resconsume/detail?enid=${enid}&lang=PH&from_channel=11&hot_order_type=plays_pv&source_domain=www.4khotvideo.com`,{
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Origin': 'https://www.4khotvideo.com',
        'Referer': 'https://www.4khotvideo.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Sec-GPC': '1',
        'TE': 'trailers'
    }
})
const json = await data.json()
// console.log(json)
return json
    
}


export async function GetStreamMovie(uk,share_id,fid) {
    // harus ganti timestamp
    const data = await fetch(`https://api.ytbvideoly.com/share/streaming?uk=${uk}&shareid=${share_id}&sign=9d06150a741b16b2da92bf646e749b263222af63&jsToken=ewre&type=M3U8_FLV_264_480&fid=${fid}&esl=1&play_from=4khot_b&isplayer=1&ehps=1&clienttype=1&app_id=250528&web=1&channel=dubox&timestamp=${Date.now()}`,{
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Origin': 'https://www.4khotvideo.com',
        'Referer': 'https://www.4khotvideo.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Sec-GPC': '1',
        'TE': 'trailers'
    }
})
const json = await data.text()
return json
    
}

// GetStreamMovie()

// type M3U8_FLV_264_480

// parameter yang di butuhkan getstream
// uk (uk)
// shareid (share_id)
// fid (fs_id)
// GetHotMovie()

// GetDetailMovie()

