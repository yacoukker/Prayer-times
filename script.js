let cities =["Tangier","Rabat","Fes","Oujda","Casablanca","Marrakesh","Merzouga","Agadir" , "Guelmim","Dakhla","Zagora","Boujdour","zag"] ;

cities.forEach(city=>{
    const content = `<li>${city}</li>` ;
    document.getElementById("list__cities").innerHTML += content ;
});
let firstCity = document.querySelector(".menu li:first-child")
firstCity.classList.add("active");
getPrayerTime(firstCity.innerText) ;

const dropdown = document.querySelector('.dropdown') ;
const select = dropdown.querySelector('.select') ;
const caret = dropdown.querySelector('.caret') ;
const menu = dropdown.querySelector('.menu') ;
const items = dropdown.querySelectorAll('.menu li') ;
const selected = dropdown.querySelector('.selected span') ;

select.addEventListener('click',()=>{
    caret.classList.toggle('caret-retate') ;
    menu.classList.toggle('open__menu')
});

items.forEach(item =>{
    item.addEventListener('click',()=>{
        selected.innerText = item.innerText ;
        getPrayerTime(item.innerText)
        menu.classList.remove('open__menu')
        caret.classList.remove('caret-retate')
        items.forEach(item=>{
            item.classList.remove('active')
        })
        item.classList.add('active')
    })
});

function getPrayerTime(city){
    let param = {
        country : "MA" ,
        city : city
    
    }
    axios.get('http://api.aladhan.com/v1/timingsByCity', {
        params: param
    })
    .then(function (response) {
    let timing = response.data.data.timings ;
    fillPrayerTime('Fajr',timing.Fajr);
    fillPrayerTime('Sunrise',timing.Sunrise) ;
    fillPrayerTime('Dhuhr',timing.Dhuhr);
    fillPrayerTime('Asr',timing.Asr);
    fillPrayerTime('Maghrib',timing.Maghrib);
    fillPrayerTime('Isha',timing.Isha);
    let gregorian = response.data.data.date.gregorian ;
    let hijri = response.data.data.date.hijri ;
    document.getElementById('miladi').innerHTML = `${gregorian.month.en} ${gregorian.day} ,  ${gregorian.year}`;
    document.getElementById('hijri').innerHTML =`
                                                ${gregorian.weekday.en}
                                                ${hijri.day}
                                                <span>${hijri.month.en}</span>
                                                ${hijri.year} H
                                                ` ;
    let currentdate = new Date()
    let currentTime = `${currentdate.getHours().toString().padStart(2, '0')}:${currentdate.getMinutes().toString().padStart(2, '0')}`
    document.getElementById('time').innerHTML = currentTime ;
    highlightNextPrayer(timing, currentTime);
    })
    .catch(function (error) {
    console.log(error);
    });
}
function fillPrayerTime(id , time){
    document.getElementById(id).innerHTML = time ;
}
function highlightNextPrayer(timing, currentTime) {
    const prayerTimes = [
        { name: 'Fajr', time: timing.Fajr },
        { name: 'Sunrise', time: timing.Sunrise },
        { name: 'Dhuhr', time: timing.Dhuhr },
        { name: 'Asr', time: timing.Asr },
        { name: 'Maghrib', time: timing.Maghrib },
        { name: 'Isha', time: timing.Isha }
    ];

    // Remove the highlight class from all prayer times
    document.querySelectorAll('.prayer__grp').forEach(prayer => {
        prayer.classList.remove('next__prayer');
    });

    // Find the next prayer time
    let nextPrayer = prayerTimes.find(prayer => currentTime < prayer.time);

    // If no next prayer is found, the next prayer is Fajr of the next day
    if (!nextPrayer) {
        nextPrayer = prayerTimes[0];
    }

    // Highlight the next prayer time
    document.querySelector(`.prayer__grp:has(#${nextPrayer.name})`).classList.add('next__prayer');
}