//fetch data
$(document).ready(() => {
    getAllUnFinishedTasks();
});

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
        Swal.fire(
            'Fields cannot be empty!!',
            'Validate your fields',
            'error'
        );
    }
});

//save task
function saveTask(dataObj) {
    (async () => {
        await fetch('https://trinet-todo-app.herokuapp.com/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your task has been saved',
                    showConfirmButton: false,
                    timer: 1500
                });

                //get all tasks
                getAllUnFinishedTasks();
                //reset form fields
                resetFormFields();
            })
            .catch(error => {
                Swal.fire(
                    error,
                    'Error',
                    'error'
                );
            });
    })();
}

//get all unfinished tasks
function getAllUnFinishedTasks() {
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
                //empty container
                $('#container').empty();

                let taskList = data;
                for (let i = 0; i < taskList.length; i++) {
                    let date = moment(taskList[i].date).format('YYYY-MM-DD');

                    $('#container').append(
                        `
                        <div class="task" id=task-${i}>
                            <span class="id" id=id-${i}>${taskList[i]._id}</span>
                            <div class="header" id=header-${i}>
                                <h3 class="task-topic" id=task-topic-${i}>${taskList[i].title}</h3>
                                <p class="topic-description" id=topic-description-${i}>
                                    ${taskList[i].body}
                                </p>
                            </div>
                            <span class="task-time" id=task-time-${i}>${taskList[i].time}</span>
                            <span class="task-date" id=task-date-${i}>${date}</span>
                            <label class="switch">
                                <input type="checkbox" class="finished-button" id="finished-button-${i}">
                                <span class="slider round"></span>
                            </label>
                            <span class="delete-task material-icons-outlined" id=delete-task-${i}>delete</span>                  
                        </div>
                        `
                    );
                }
            })
            .catch(error => {
                Swal.fire(
                    error,
                    'Error',
                    'error'
                );
            })
            .finally(() => {
                /*$('.finished-button').click(function(){
                    if($(this).is(':checked')){
                        console.log(true);
                    } else {
                        console.log(false);
                    }
                });*/

                /*$('.finished-button').prop( "checked", true );*/
                finishTask();
            });
    })();
}

//get all finished tasks
function getAllFinishedTasks() {
    (async () => {
        await fetch('https://trinet-todo-app.herokuapp.com/get-finished-tasks', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                //empty container
                $('#container').empty();

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
                            <label class="switch">
                                <input type="checkbox" class="finished-button" id="finished-button-${i}">
                                <span class="slider round"></span>
                            </label>
                            <span class="delete-task material-icons-outlined" id=delete-task-${i}>delete</span>
                        </div>
                        `
                    );
                }
            })
            .catch(error => {
                Swal.fire(
                    error,
                    'Error',
                    'error'
                );
            })
            .finally(() => {
                /*$('.finished-button').click(function(){
                    if($(this).is(':checked')){
                        console.log(true);
                    } else {
                        console.log(false);
                    }
                });*/

                $('.finished-button').prop("checked", true);
                unFinishTask();
            });
    })();
}

//reset form fields
function resetFormFields() {
    $('#date').val('');
    $('#time').val('');
    $('#topic').val('');
    $('#description').val('');
}

//delete task
$('#container').on('click', '.delete-task', function () {
    $('.delete-task').click(function () {
        let parent = $(this).parent().attr('id');
        let task_id = $(`#${parent}`).children('span').eq(0).text();

        //delete task from the db
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#279B1C',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
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
                            $(`#${parent}`).remove();
                            Swal.fire(
                                'Task Deleted!',
                                'Your task has been deleted.',
                                'success'
                            )
                        })
                        .catch(error => console.error(error));
                })();
            }
        });
    });
});

//finish task
function finishTask() {
    $('.finished-button').click(function () {
        if ($(this).is(':checked')) {

            let parent = $(this).parent().parent().attr('id');
            let task_id = $(`#${parent}`).children('span').eq(0).text();

            (async () => {
                await fetch('https://trinet-todo-app.herokuapp.com/finish-task', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: task_id}),
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Your task has been finished',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        //get all unfinished tasks
                        getAllUnFinishedTasks();
                    })
                    .catch(error => {
                        Swal.fire(
                            error,
                            'Error',
                            'error'
                        );
                    });
            })();
        }
    });
}

//un finish task
function unFinishTask() {
    $('.finished-button').click(function () {

        if (!$(this).is(':checked')) {

            let parent = $(this).parent().parent().attr('id');
            let task_id = $(`#${parent}`).children('span').eq(0).text();

            (async () => {
                await fetch('https://trinet-todo-app.herokuapp.com/undo-finish-task', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: task_id}),
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Your task set to Un Finished',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        //get all unfinished tasks
                        getAllFinishedTasks();
                    })
                    .catch(error => {
                        Swal.fire(
                            error,
                            'Error',
                            'error'
                        );
                    });
            })();
        }
    });
}

//current tasks load
$('#current').click(function () {
    $(this).css('color', '#1d1c1c');
    $('#finished').css('color', '#747171');
    getAllUnFinishedTasks();
});

//finished tasks load
$('#finished').click(function () {
    $(this).css('color', '#1d1c1c');
    $('#current').css('color', '#747171');
    getAllFinishedTasks();
});


