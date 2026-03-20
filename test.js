const responsePlaylist= await fetch("https://spotisaver.net/api/get_playlist.php?id=7DcJ6fEBb7BaKuYKTwiDxK&type=track&lang=en", {
  "headers": {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
     "Referer": "https://spotisaver.net/en/track/1USo158Kncaxfyq9q306dn/"
  },
  "body": null,
  "method": "GET"
});

const dataPlaylists = await responsePlaylist.json();
console.log(dataPlaylists);

const delay = (ms) => new Promise(r => setTimeout(r, ms));
await delay(5000); // ⭐ penting: beri jeda

const responseDownload = await fetch(
  "https://spotisaver.net/api/download_track.php",
  {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      download_dir: "downloads",
      filename_tag: "SPOTISAVER",
      is_premium: false,
      track: dataPlaylists.tracks,
    }),
  }
);

const data = await responseDownload.json();
console.log(data);