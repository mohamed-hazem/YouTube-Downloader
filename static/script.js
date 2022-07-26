// Elements
let urlInput = document.querySelector("#url")
let getVideoBtn = document.querySelector("#get")

let img = document.querySelector(".info img")
let title = document.querySelector(".info .title")
let time = document.querySelector("#time")

let dlDiv = document.querySelector("#dl-div")
let select = document.querySelector("#quality")
let dlBtn = document.querySelector("#dl-btn")
let dlLink = document.querySelector("#dl-link")

let errorSpan = document.querySelector("#error")
let loader = document.querySelector("#loader")

// initial commands
urlInput.focus()

// get video info and show it
function getVideo(url) {
    loader.style.display = "flex"

    fetch("/get_video?url="+url)
    .then(response => response.json())
    .then(data => show(data))
    .catch(_ => error())
}

// show data
function show(info) {

    error(showError=false)

    loader.style.display = "none"
    dlDiv.style.display = "block"
    img.src = info["thumbnail"]
    img.alt = info["title"]
    title.innerText = info["title"]
    time.innerText = getVideoTime(info["length"])

    let qualities = info["quality"]

    removeAllChildNodes(select)
    
    let mutedElement = '&nbsp;<i class="fa-solid fa-volume-xmark"></i>'
    let hd = '<sup class="sup">HD</sup>'

    qualities.forEach(qualityInfo => {
        quality = qualityInfo[0]
        audio = Boolean(qualityInfo[1])

        option = document.createElement('div')
        option.classList.add("res")
        
        option.innerHTML = quality
        if (quality.length == 5) {
            option.innerHTML += hd
        }
        if (!audio) {
            option.innerHTML += mutedElement
        }
        
        option.onclick = selectQuality

        select.appendChild(option)

        getVideoBtn.disabled = false
    })
}

getVideoBtn.onclick = () => {
    this.disabled = true
    url = urlInput.value
    getVideo(url)
}

// get URL and download
function getUrl(url, quality) {
    loader.style.display = "flex"

    fetch("/get_url?url="+url+"&quality="+quality)
    .then(response => response.json())
    .then(data => redirect(data["url"], quality))
}

function redirect(url, quality) {
    let ext = (quality == "MP3") ? ".mp3" : ".mp4"
    loader.style.display = "none"
    dlLink.href = url
    dlLink.download = title.innerText + ext
    dlLink.click()
}

dlBtn.onclick = () => {
    url = urlInput.value
    quality = getSelected()

    getUrl(url, quality)
}

// restart
function restart() {
    error(showError=false)
    dlDiv.style.display = "none"
    removeAllChildNodes(select)
    urlInput.value = ""
    urlInput.focus()
}

// paste
async function paste() {
    let text = await navigator.clipboard.readText()
    urlInput.value = text
    getVideoBtn.click()
}

// show & hide error
function error(showError=true) {
    if (showError) {
        errorSpan.style.display = "block"
        loader.style.display = "none"
    } 
    else {
        errorSpan.style.display = "none"
    }
}

// select quality functions
function getSelected() {
    let selections = document.querySelectorAll(".res")
    let s
    selections.forEach(selection => {
        if (selection.classList[1] == "selected") {
            s = selection.innerText
        }
    })
    
    return s
}

function selectQuality() {
    let selections = document.querySelectorAll(".res")
    selections.forEach(selection => {
        selection.classList.remove("selected")
    })

    this.classList.add("selected")
}

// help functions
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function zfill(num) {
    if (num < 10) {
        return "0" + num
    }
    return num
}

function getVideoTime(duration) {
    duration = parseInt(duration)

    if (duration < 60) {
        return "00:" + zfill(duration)
    }
    else if (duration > 60 && duration < 3600) {
        min = ~~(duration / 60)
        sec = duration % 60

        return zfill(min) + ":" + zfill(sec)
    }
    else {
        h = ~~(duration / 3600)
        rest = duration % 3600
        min = ~~(rest / 60)
        sec = rest % 60

        return zfill(h) + ":" + zfill(min) + ":" + zfill(sec)
    }
}