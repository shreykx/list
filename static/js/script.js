function fillTodos(array_todos) {
    const parent_url = document.getElementById("parent_url")
    parent_url.innerHTML = ""



    const li_up = document.createElement("li")
    li_up.classList.add("py-20")
    parent_url.appendChild(li_up)
    array_todos.forEach(element => {
        const li = document.createElement("li")
        li.classList.add("p-1", "flex");


        const button = document.createElement("button");
        button.style.backgroundColor = "#D9D9D9"
        button.classList.add("w-full", "active:opacity-[0.8]", "px-4", "py-8", "rounded-[30px]");
        button.id = `todo-${element[0]}`


        const button_span = document.createElement("span")
        button_span.innerText = `${element[1]}`
        button_span.classList.add("text-xl", "font-bold")

        button.appendChild(button_span)

        li.appendChild(button)

        const checkbox_div = document.createElement("div");
        checkbox_div.classList.add("flex", "p-1", "justify-center", "align-center", "items-center");
        const checkbox_input = document.createElement("input")
        checkbox_input.type = "checkbox"
        checkbox_input.id = `todo-${element[0]}`
        checkbox_input.classList.add("shrink-0", "mt-0.5", "cursor-pointer", "border-gray-200", "rounded", "text-blue-600", "focus:ring-blue-500", "disabled:opacity-50", "disabled:pointer-events-none", "dark:bg-neutral-800", "dark:border-neutral-700", "dark:checked:bg-blue-500", "dark:checked:border-blue-500", "dark:focus:ring-offset-gray-800", "h-6", "w-6");



        checkbox_div.appendChild(checkbox_input);


        li.appendChild(checkbox_div)

        parent_url.appendChild(li)


    });

}
async function get_all_folders() {
    try {
        const response = await fetch('/get/folders');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching folders:', error);
    }
}

function get_fill_all_todos(query) {
    fetch(`/get/todos/${query}`)
        .then(response => {
            // console.log('Response:', response);
            return response.json();
        })
        .then(data => {
            // console.log('Data:', data);
            fillTodos(data);
        })
        .catch(error => console.error('Error fetching todos:', error));
}



function add_todo_to_folder(foldername, todo_content) {
    fetch('/create/todo', { // Replace with your Flask server URL if different
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content : `${todo_content}`,
            time : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}),
            foldername : `${foldername}`
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const folderName = document.getElementById("WXX").value.trim();
            console.log(folderName);
            
            get_fill_all_todos(folderName === "Wracker" ? '*' : folderName);




            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
}


function make_new_todo() {
    const parent_div = document.getElementById("parent_div");
    parent_div.innerHTML = "";
    parent_div.classList.add("rounded-[20px]", "overflow-hidden")
    parent_div.style.backgroundColor = "#D9D9D9"; // changes color to something grayish


    const todo_text_input = document.createElement("input");
    todo_text_input.type = "text";
    todo_text_input.style.backgroundColor = "#D9D9D9";
    todo_text_input.placeholder = "Type something here...";
    todo_text_input.className = "p-8 outline-none flex items-center w-full";
    todo_text_input.id = "todo_text_input"

    parent_div.appendChild(todo_text_input) // appending the todo text box, for taking input from the user


    const cancel_button = document.createElement("button");
    cancel_button.type = "button";
    cancel_button.style.backgroundColor = "#CD4141";
    cancel_button.className = "w-full p-4 cursor-pointer active:opacity-[0.8]";
    cancel_button.id = "cancel-new-todo"; // using this id as the identifier, you can cancel the todo


    const button_text = document.createElement("span");
    button_text.className = "font-bold text-white text-[19px]";
    button_text.textContent = "Cancel";

    cancel_button.appendChild(button_text)

    parent_div.appendChild(cancel_button); //appending in case user wants to change their minds to create a new todo

    const next_button = document.createElement("button");
    next_button.type = "button";
    next_button.style.backgroundColor = "#4154CD";
    next_button.className = "w-full p-4 cursor-pointer active:opacity-[0.8]";
    next_button.id = "next-new-todo"; // taking the user forward in their journey


    const next_button_text = document.createElement("span");
    next_button_text.className = "font-bold text-white text-[19px]";
    next_button_text.textContent = "Next";


    next_button.appendChild(next_button_text);


    parent_div.appendChild(next_button)


    next_button.addEventListener("click", () => { // the user prefers to go next
        const new_todo_content = todo_text_input.value.trim();
        if (new_todo_content) {
            parent_div.innerHTML = ""
            const ul = document.createElement("ul");



            // getting async to handle asynchronous queries.. javascript fetch api actually has an async nature
            (async ()=> {
                const available_folders = await get_all_folders();
                // console.log(available_folders);
        

                available_folders.forEach(element => {
                    const list_item = document.createElement("li");
                    list_item.className = "h-full w-full";
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "flex justify-center align-center items-center p-4 px-20 font-bold text-[20px]"; // will fix it cuz the text is not centered
                    button.textContent = `${element}`;
                    button.id = `select-folder-${element}`;
                    list_item.appendChild(button)
                    console.log(`Appended button with ID: ${button.id}`);

                    ul.appendChild(list_item)
                });
                parent_div.appendChild(ul)

                // console.log("Done");
                
                const folder_buttons = document.querySelectorAll("[id^='select-folder']");
                
                folder_buttons.forEach(button => {
                    button.addEventListener("click", () => {
                        const foldername = button.id.split("-")[2]
                        
                        add_todo_to_folder(foldername, new_todo_content);

                        back_to_pavillion()
                    });
                });
                
                
            })()
        } else {
            alert("Please enter a value for the todo.");
        }
    })

    cancel_button.addEventListener("click", () => {
        back_to_pavillion()
    })
}


function back_to_pavillion() {
    parent_div.innerHTML = "";
    parent_div.classList.remove(...parent_div.classList);
    parent_div.style.backgroundColor = "white";
    const new_todo_button = document.createElement("button");
    new_todo_button.type = "button";
    new_todo_button.id = "new_todo_button";
    new_todo_button.className = "text-[24px] font-bold px-8 py-2 rounded-full select-none active:opacity-[0.8]";
    new_todo_button.style.backgroundColor = "#D9D9D9";
    new_todo_button.textContent = "New";


    new_todo_button.addEventListener("click", make_new_todo);

    parent_div.appendChild(new_todo_button)
}
get_fill_all_todos("*")