// Elements
let urlInput = document.querySelector("#url")
let getVideoBtn = document.querySelector("#get")

let img = document.querySelector(".info img")
let title = document.querySelector(".info .title")
let time = document.querySelector("#time")

let dlDiv = document.querySelector("#dl-div")
let select = document.querySelector("#quality")
let dlBtn = document.querySelector("#dl-btn")

let loader = document.querySelector("#loader")

// initial commands
urlInput.focus()

// get video info and show it
function getVideo(url) {
    loader.style.display = "flex"

    fetch("/get_video?url="+url)
    .then(response => response.json())
    .then(data => show(data))
}

// show data
function show(info) {

    loader.style.display = "none"
    dlDiv.style.display = "block"
    img.src = info["thumbnail"]
    img.alt = info["title"]
    title.innerText = info["title"]
    console.log(getVideoTime(info["length"]))
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

getVideoBtn.onclick = function() {
    this.disabled = true
    url = urlInput.value
    getVideo(url)
}

// get URL and download
function getUrl(url, quality) {
    loader.style.display = "flex"

    fetch("/get_url?url="+url+"&quality="+quality)
    .then(response => response.json())
    .then(data => redirect(data["url"]))
}

function redirect(url) {
    loader.style.display = "none"
    window.open(url, '_blank')
}

dlBtn.onclick = () => {
    url = urlInput.value
    quality = getSelected()

    getUrl(url, quality)
}

// restart
function restart() {
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

function getVideoTime(duration) {
    duration = parseInt(duration)

    if (duration < 60) {
        return "00:" + duration
    }
    else if (duration > 60 && duration < 3600) {
        min = ~~(duration / 60)
        sec = duration % 60

        return min + ":" + sec
    }
    else {
        h = ~~(duration / 3600)
        rest = duration % 3600
        min = ~~(rest / 60)
        sec = rest % 60

        return h + ":" + min + ":" + sec
    }
}