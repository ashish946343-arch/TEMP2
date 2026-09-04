import https from 'https';

const testUrls = [
  "https://eoimages.gsfc.nasa.gov/images/imagerecord/92000/92485/daxing_tm5_2015243_lrg.jpg",
  "https://eoimages.gsfc.nasa.gov/images/imagerecord/145000/145688/daxing_oli_2019253_lrg.jpg",
  "https://eoimages.gsfc.nasa.gov/images/imagerecord/148000/148560/hangzhou_tm5_2015281_lrg.jpg",
  "https://eoimages.gsfc.nasa.gov/images/imagerecord/90000/90795/dubai_etm_2000305_lrg.jpg",
  "https://eoimages.gsfc.nasa.gov/images/imagerecord/90000/90795/dubai_oli_2016298_lrg.jpg"
];

testUrls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} : ${url}`);
  });
});
