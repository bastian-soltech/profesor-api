const axios = require("axios");

async function Melody(){
    const MetadataAudio = await axios.get("https://melodyinbox.com/r.php?q=rip_love_slowed")
    // console.log(MetadataAudio.data)
    const response = await axios.post('https://v5-n01.yt2api.com/api/v5/auth', {
      // Masukkan data body di sini
      // username: 'your_user',
      // password: 'your_password'
    }, {
      headers: {
        'Content-Type': 'application/json'
        // Masukkan header tambahan jika diperlukan
      }
    });
    console .log(response.data)
    // const iframe = await axios.get("https://api.ytgoconverter.net/api/iframe.php?url=YdCa97x57lM")
    // console.log(iframe.data)
}

Melody()


