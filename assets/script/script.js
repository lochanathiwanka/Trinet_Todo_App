//add new task
$('#btnAdd').click(function () {
    //get date
    let date = $('#date').val();

    //get time
    let time = $('#time').val();
    const newTime = moment(time, ["HH.mm"]).format("hh:mm A");

    //get topic
    let topic = $('#topic').val();

    //get description
    let description = $('#description').val();

    if (date !== '' && time !== '' && topic.length > 0 && description.length > 0) {

        //save task in to db
        saveTask({
            "date": date,
            "time": newTime,
            "title": topic,
            "body": description,
            "finished": false
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
    }
});

/*$('#container').append(
                            `
                <div class="task" id="task-0">
                <span class="id" id="id-0">12354</span>
                <div class="header" id="header-0">
                    <div class="color-circle"></div>
                    <h3 class="task-topic" id="task-topic-0">Study</h3>
                    <p class="topic-description" id="topic-description-0">
                        I have to learn 3<br>subjects for my A/L’s.
                    </p>
                </div>
                <span class="task-time" id="task-time-0">08.00 am</span>
                <span class="task-date" id="task-date-0">2021-07-20</span>
                <span class="update-task material-icons-outlined" id="update-task-0">refresh</span>
                <span class="delete-task material-icons-outlined" id="delete-task-0">delete</span>
            </div>
            `
                        );*/

//save task
async function saveTask(dataObj) {
    await fetch('https://trinet-todo-app.herokuapp.com/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error(error);
        });
}

//get all tasks
fetch('https://trinet-todo-app.herokuapp.com/get-all-by-user', {
    mode: "no-cors"
})
    .then((response) => response.json())
    .then((json) => console.log(json));

