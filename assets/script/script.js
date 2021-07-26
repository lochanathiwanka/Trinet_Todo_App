$(document).ready(() => {
    getAllTasks();
    deleteTask();
})

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
        });
    } else {
        alert('Fields cannot be empty!');
    }
});

//save task
function saveTask(dataObj) {
    (async () => {
        fetch('https://trinet-todo-app.herokuapp.com/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
            .then(response => response.json())
            .then(data => {
                //empty container
                $('#container').empty();
                //get all tasks
                getAllTasks();
                //reset form fields
                resetFormFields();
            })
            .catch(error => {
                console.error(error);
            });
    })();
}

//get all tasks
function getAllTasks() {
    (async () => {
        await fetch('https://trinet-todo-app.herokuapp.com/get-all-tasks', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                let taskList = data;
                for (let i = 0; i < taskList.length; i++) {
                    let date = moment(taskList[i].date).format('YYYY-MM-DD');

                    $('#container').append(
                        `
                        <div class="task" id=task-${i}>
                            <span class="id" id=id-${i}>${taskList[i]._id}</span>
                            <div class="header" id=header-${i}>
                                <div class="color-circle"></div>
                                <h3 class="task-topic" id=task-topic-${i}>${taskList[i].title}</h3>
                                <p class="topic-description" id=topic-description-${i}>
                                    ${taskList[i].body}
                                </p>
                            </div>
                            <span class="task-time" id=task-time-${i}>${taskList[i].time}</span>
                            <span class="task-date" id=task-date-${i}>${date}</span>
                            <span class="update-task material-icons-outlined" id=update-task-${i}>refresh</span>
                            <span class="delete-task material-icons-outlined" id=delete-task-${i}>delete</span>
                        </div>
                        `
                    );
                }
                deleteTask();
            })
            .catch(error => console.error(error));
    })();
}

function resetFormFields() {
    $('#date').val('');
    $('#time').val('');
    $('#topic').val('');
    $('#description').val('');
}

//delete task
function deleteTask() {
    $('.delete-task').click(function () {
        let parent = $(this).parent().attr('id');
        let task_id = $(`#${parent}`).children('span').eq(0).text();

        //delete task from the db
        (async () => {
            await fetch('https://trinet-todo-app.herokuapp.com/delete-todo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: task_id}),
            })
                .then(response => response.json())
                .then(data => {
                    alert('Task deleted!');
                    $(`#${parent}`).remove();
                })
                .catch(error => console.error(error));
        })();
    });
}

