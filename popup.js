const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const moodColors = ["#0061A1","#15A0B0","#58CCAD","#62B378","#9CD97E"]

var smallJournalSaveButton = document.getElementById("journalSubmitButton")
var bigJournalSaveEditButton = document.getElementById("save")
var journalEditState = false

var expandButton = document.getElementById("expandButton")
var cornerButton = document.getElementById("cornerButton")
var homeButton = document.getElementById("homeButton")

var horribleButton = document.getElementById("horrible")
var badButton = document.getElementById("bad")
var okButton = document.getElementById("ok")
var goodButton = document.getElementById("good")
var greatButton = document.getElementById("great")

var miniHorribleButton = document.getElementById("miniAwful")
var miniBadButton = document.getElementById("miniBad")
var miniOkButton = document.getElementById("miniOk")
var miniGoodButton = document.getElementById("miniGood")
var miniGreatButton = document.getElementById("miniGreat")


var title = document.getElementById("currentDayHeader")
var subtitle = document.getElementById("yearHeader")
var headers = document.getElementsByClassName("headers")
var smallTextbox = document.getElementById("notes")
var largeTextbox = document.getElementById("largeJournal")
var yearChanger = document.getElementById("yearChanger")
var dayPreview = document.getElementById("dayPreview")

var homePage = document.getElementById("HomeContent")
var calendarPage  = document.getElementById("calendarPage")
var journalPage = document.getElementById("journalPage")


var now = new Date()
var selectedDay = now.getDate() // range: 1-31
var selectedMonth = now.getMonth() + 1 // range: 1-12
var selectedYear = now.getFullYear()
var dateString;
var selectedEntry;

var userData;

//SWITCH PAGES
function goToHomePage(){
  for(var i = 0; i < headers.length; i++){
    headers[i].style.display = 'block'
  }
  homePage.style.display = 'block'
  calendarPage.style.display = 'none'
  journalPage.style.display = 'none'
  yearChanger.style.display = 'none'
}

function goToCalendarPage(){
  for(var i = 0; i < headers.length; i++){
    headers[i].style.display = 'none'
  }
  homePage.style.display = 'none'
  journalPage.style.display = 'none'
  calendarPage.style.display = 'block'
  yearChanger.style.display = 'block'
}

function goToJournalPage(){
  for(var i = 0; i < headers.length; i++){
    headers[i].style.display = 'block'
  }
  homePage.style.display = 'none'
  calendarPage.style.display = 'none'
  journalPage.style.display = 'block'
  yearChanger.style.display = 'none'
}


//DATA I/O


function setData(key,value){
  console.log("Setting:" + key + " to " + value)
  browser.storage.local.set({
    [key]: value
  });
}

function getData(key,callback){
  var storageItem = browser.storage.local.get(key);
  storageItem.then((data) => {
    if(data[key] === undefined){
      console.log("No data for key: " + key)
      callback("")
    } else {
      callback(data[key])
    }
  })
}

//Helpers

function saveSmallTextBox(){
  var text = smallTextbox.value
  editEntry(selectedYear,selectedMonth,selectedDay,null,text)
}

function saveBigTextBox(){
  var text = largeTextbox.value
  editEntry(selectedYear,selectedMonth,selectedDay,null,text)
}

function updateDate(year,monthNum,day){
  console.log("changing selected day to: " + year + " " + monthNum + " " + day)
  var now = new Date(year + "-" + monthNum + "-" + day)
  selectedDay = day
  selectedMonth = monthNum
  selectedYear = year
  var monthString = month[monthNum-1]
  dateString = monthString + " " + selectedDay + nth(selectedDay)

  title.textContent = dateString
  subtitle.textContent = selectedYear

}


/**
 * Returns the ordinal indicator (1'st', 2'nd', 3'rd') of the number
 * @param  {Number} i The number
 * @return {String} The ordinal indicator ("th", "nd", "rd" or "st")
 */
function nth(i){
  if(i > 3 && i < 21) return "th"
  if(i % 10 == 3) return "rd"
  if(i % 10 == 2) return "nd"
  if(i % 10 == 1) return "st"
  return "th"
}

function getDateFromElement(element){
  d = element.className.replace( /[^\d.]/g, '' );
  console.log(element.className + " " + d)
  m = element.parentElement.parentElement.parentElement.id.replace( /[^\d.]/g, '' );
  return [selectedYear,m,d]
}

function getEntry(yearNum,monthNum,dayNum){
  if(!userData) console.error("User data is undefined, failed to retreive entry.")
  return userData[yearNum.toString()][monthNum-1][dayNum-1]
}

function editEntry(yearNum,monthNum,dayNum,moodId = null,journalText = null){
  console.log("Editing entry: " + yearNum + "-" + monthNum + "-" + dayNum + " Mood: " + moodId + " Journal: " + journalText)
  if(!userData) console.error("User data is undefined, failed to edit entry.")
  if(moodId !== null && moodId >= 0 && moodId <= 4){
    var element = document.querySelector("#month_" + monthNum + " .date_" + dayNum)
    element.style['background-color'] = moodColors[moodId]
    userData[yearNum.toString()][monthNum-1][dayNum-1].mood = moodId
  }
  if(journalText !== null){
    userData[yearNum.toString()][monthNum-1][dayNum-1].entry = journalText
  }
}

function bigJournalChangeState(editting){
  console.log("journal editting state: " + editting)
  journalEditState = editting
  if(editting){
    largeTextbox.readOnly = true
    bigJournalSaveEditButton.textContent = "edit"
    document.getElementById("moodOptions").style.display = 'none'
    document.getElementById("sentence").style.display = 'block'
    var todaysMood = document.getElementById("todayMood")
    if(selectedEntry.mood === null){
      todaysMood.style.display = 'none'
    } else {
      document.querySelector('#sentence .moodSentence').textContent = "Today was"
      todaysMood.style['background-color'] = moodColors[selectedEntry.mood]
    }
  } else {
    largeTextbox.readOnly = false
    bigJournalSaveEditButton.textContent = "save"
    document.getElementById("moodOptions").style.display = 'block'
    document.getElementById("sentence").style.display = 'none'
  }
}

//EVENTS
function onDataLoaded(){
  smallTextbox.value = userData[selectedYear.toString()][selectedMonth-1][selectedDay-1].entry
}

function onPageLoaded(){
  updateDate(selectedYear,selectedMonth,selectedDay)
}

function onSmallJournalSubmit(){
  saveSmallTextBox()
}

function onBigJournalSubmit(){
  if(journalEditState){
    bigJournalChangeState(false)
  } else {
    saveBigTextBox()
  }
}

function onJournalExpanded(){
  largeTextbox.value = smallTextbox.value
  goToJournalPage()
}

function onMoodPicked(moodId){
  editEntry(selectedYear,selectedMonth,selectedDay,moodId)
}

function onCornerClicked(){
  goToCalendarPage()
}

function onHomeButtonClicked(){
  var now = new Date() //TODO: Dont use this dumb built in date function
  updateDate(now.getFullYear(),now.getMonth()+1,now.getDate())
  selectedEntry = getEntry(now.getFullYear(),now.getMonth()+1,now.getDate())
  smallTextbox.value = selectedEntry.entry
  goToHomePage()
}

function onDateClicked(element){
  var date = getDateFromElement(element)
  updateDate(date[0],date[1],date[2])
  console.log(getEntry(date[0],date[1],date[2]))
  selectedEntry = getEntry(date[0],date[1],date[2])
  largeTextbox.value = selectedEntry.entry
  bigJournalChangeState(true)
  goToJournalPage()
}

function onDateHover(element, left){
  var date = getDateFromElement(element)
  if(left){
    dayPreview.textContent = ""
  } else {
    dayPreview.textContent = month[date[1]-1] + " " + date[2]
  }
}

document.addEventListener("DOMContentLoaded", onPageLoaded);

smallJournalSaveButton.addEventListener("click", onSmallJournalSubmit)
bigJournalSaveEditButton.addEventListener("click", onBigJournalSubmit)
expandButton.addEventListener("click", onJournalExpanded)
cornerButton.addEventListener("click",onCornerClicked)
homeButton.addEventListener("click",onHomeButtonClicked)

horribleButton.addEventListener("click",function(){ onMoodPicked(0)})
badButton.addEventListener("click",function(){ onMoodPicked(1)})
okButton.addEventListener("click",function(){ onMoodPicked(2)})
goodButton.addEventListener("click",function(){ onMoodPicked(3)})
greatButton.addEventListener("click",function(){ onMoodPicked(4)})

miniHorribleButton.addEventListener("click",function(){ onMoodPicked(0)})
miniBadButton.addEventListener("click",function(){ onMoodPicked(1)})
miniOkButton.addEventListener("click",function(){ onMoodPicked(2)})
miniGoodButton.addEventListener("click",function(){ onMoodPicked(3)})
miniGreatButton.addEventListener("click",function(){ onMoodPicked(4)})

window.addEventListener("unload", function(){
  setData("USER_DATA",userData)
  console.log("bye")
})

//INITIALIZING STUFF

function makeDatesClickable(year){
  for(var monthNum = 1; monthNum <= month.length; monthNum++){
    var monthDays = new Date(year,monthNum,0).getDate()
    for(var dateNum = 1; dateNum <= monthDays; dateNum++){
      let element = document.querySelector("#month_" + (monthNum) + " .date_" + (dateNum))
      element.addEventListener("click",function(){onDateClicked(element)})
      element.addEventListener("mouseout", function(){onDateHover(element, true)})
      element.addEventListener("mouseover", function(){onDateHover(element, false)})
    }
  }
}

/**
 * Populates the "userData" variable with an object containing dates and their corresponding journal entries and mood level
 * The data can be accessed like so: Object["Year"][MonthNumber-1][DateNumber-1]
 * this returns user data for a single date in the form {"entry": "Journal Entry", "mood": -1}
 * Ex. to access user data of June 7, 2022 (2022-06-07) you would type: Object["2022"][5][6]
 * @param  {Object} data User data requested from local computer storage
 * @return {null}
 */
function init(data){
  if(data == ""){ //user has no data, generate them a blank data frame
    data = {}
    for(var year = selectedYear-1; year <= selectedYear + 1; year++){
      data[year.toString()] = []
      for(var monthNum = 0; monthNum < month.length; monthNum++){
        daysInMonth = new Date(year,monthNum+1,0).getDate()
        data[year.toString()][monthNum] = []
        for(var dayNum = 0; dayNum < daysInMonth; dayNum++){
          data[year.toString()][monthNum][dayNum] = {"entry":null,"mood":null}
        }
      }
    }
    setData("USER_DATA",data)
    loadData(data)
  } else {
    loadData(data)
    for(year in userData){
      for(var monthNum = 0; monthNum < month.length; monthNum++){
        var monthDays = userData[year][monthNum].length
        for(var dateNum = 0; dateNum < monthDays; dateNum++){
          var dateEntry = userData[year][monthNum][dateNum]
          var moodId = dateEntry.mood
          var journalEntry = dateEntry.entry
          if(moodId !== null || journalEntry !== null){
            editEntry(parseInt(year),monthNum+1,dateNum+1,moodId,journalEntry)
          }
        }
      }
    }
  }
  makeDatesClickable(selectedYear)
}

function loadData(data){
  userData = data
  onDataLoaded()
}

getData("USER_DATA",init)
