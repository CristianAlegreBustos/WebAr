const appleButton=document.getElementById("AppleButton");
const googleButton=document.getElementById("GoogleButton");
const linkToPlayStore="https://play.google.com/store/apps/details?id=ar.com.personalpay&referrer=utm_source%3DPePa%26utm_medium%3Dreferral%26utm_term%3Dhome-BanHer%26utm_content%3DDesc_Andr-plata_personal%26utm_campaign%3DRF-Ecosistema";
const linkToAppStore="https://apps.apple.com/app/apple-store/id1548817439?pt=122556632&ct=RF-Ecosistema-PePa-Banner-Home&mt=8";

googleButton.addEventListener("click", dowloadApp(linkToAppStore))

googleButton.addEventListener("click", dowloadApp(linkToAppStore));

const dowloadApp= (link)=>  location.reload(link)