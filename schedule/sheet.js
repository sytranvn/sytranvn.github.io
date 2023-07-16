window.addEventListener('load', function() {
	const today = new Date();
	const inputDate = document.querySelector('#date-input')
	inputDate.value = today.toISOString().split('T')[0]
	populateWeekday(today)
})

function populateWeekday(selectedDate) {
	const weekday = selectedDate.getDay()
	const monthday = selectedDate.getDate()
	const weekDays = Array.from(document.getElementsByClassName('week-day'))
	weekDays.forEach((wd, index) => {
		const today = new Date()
		today.setDate(monthday - weekday + index + 1)
		wd.textContent = today.toLocaleDateString()
		if (today.getDay() === weekday) {
			wd.classList.add('today')
		} else {
			wd.classList.remove('today')
		}
	})
}

document.querySelector('#date-input').addEventListener('change', function(event) {
	if (event.target.value) {
		const selectedDate = new Date(event.target.value)
		populateWeekday(selectedDate)
	}
})
