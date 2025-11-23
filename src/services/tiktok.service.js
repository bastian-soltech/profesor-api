// const base_url = 'https://ssstik.io//abc?url=UnpCRkEz==PT13TjBnek0xTURPNElUTTBrRE96UWpNMll6TQ__==QWRYYXN4V2FsTlhZc2xXYg__'

const formData = new FormData()
const cheerio = require('cheerio')

async function sstik(url) {
    formData.append('id', `${url}`);
    formData.append('locale', 'id');
    formData.append('tt', 'eG1qNHQ_'); // Jika token diperlukan
    
    // sstik
    const responseInfo = await fetch('https://ssstik.io/abc?url=dl',{
        method: 'POST',
        headers: {
            'referer':'https://ssstik.io/id',
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
        },
        body: formData
    })
    
    const dataInfo = await responseInfo.text()
    console.log(dataInfo)
    const $ = cheerio.load(dataInfo)
    const stats = $('div#trending-actions div').children().not('svg').map((i, el) => $(el).text().trim()).get();
    const statsLike = stats[1]
    const statsComment = stats[2]
    const statsShare = stats[3]
    
    const styleContent = $('style').html()
    const imageAuthorLink = $('img.result_author').attr('src')
    // const idMatch = styleContent.match(/#mainpicture\s*\{[^}]*background-image:\s*url\(['"]?(.*?)['"]?\)/);
    const videoLink = $('a.without_watermark').attr('href')
    const authorName = $('div.pd-lr h2').text().trim()
    const videoTitle = $('div#avatarAndTextUsual').find('p.maintext').text()
    const audioLink = $('a.music').attr('href')
    return{
        videoLink,
        stats:{
            statsLike,
            statsComment,
            statsShare
        },
        authorName,
        videoTitle,
        imageAuthorLink,
        audioLink
    }

    
        
}

test_sstik = async()=>{
    const result = await sstik('https://www.tiktok.com/@williesalim/video/7483538821498342663?is_from_webapp=1&sender_device=pc')
    console.log(result)
}

test_sstik()
// module.exports = {sstik}