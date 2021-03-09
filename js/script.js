const options = {
    mehotd: 'GET',
    mode: 'cors',
    cache: 'default'
}

const getTools = async () => {
    const tools = await fetch('https://pluga.co/ferramentas_search.json')
    return tools.json()
};

(async () => {
  window.tools = await getTools();
  window.counter = 12
  showTools(tools.slice(0, window.counter));
})();

document.getElementById('search').onkeydown = function(e){
    const query = e.target.value.toLowerCase()

    if(query.length > 3){ 
        const tools = window.tools.filter(tool => tool.name.toLowerCase().includes(query))
        showTools(tools);
    }else if(query.length === 0) {
        showTools(window.tools.slice(0, window.counter))
    }
}

document.getElementById('load-more').onclick = function(){
    window.counter += 12
    showTools(window.tools.slice(0, window.counter));
}

document.getElementById('close-modal').onclick = function(){
    modal.style.display = 'none'
}

const results = document.getElementById('results');

const modal = document.getElementById('modal');

document.addEventListener('click',function(e){
    e.preventDefault()
    const openModalCandidates = ['single-item', 'tool-item', 'item-name', 'tool-icon']

    if(e.target && openModalCandidates.includes(e.target.className)){
        modal.style.display = 'flex'
        const appId = e.target.getAttribute('data-open')
        const tool = window.tools.find(t => t.app_id === appId)
        let lastTools = getLastTools();

        document.getElementById('tool-modal-icon').src = tool.icon
        document.getElementById('item-name').innerHTML = tool.name
        document.getElementById('item-modal-link').href = tool.link
        document.getElementById('current-tool-icon').style.backgroundColor = tool.color
        
        
        const containerLastTools = document.getElementById('last-tools')

        containerLastTools.innerHTML = lastTools.map(tool =>  
            `
                <a class="tool-item" title="${tool.name}" href="/" data-open="${tool.app_id}" style="background-color:${tool.color}">
                    <div id="${tool.app_id}" class="single-item">
                        <img src="${tool.icon}" alt="${tool.name}">
                        <p class="item-name">${tool.name}</p>
                    </div>
                </a>
            `
        ).join('')

        if(!lastTools.find(tool => tool.app_id === appId)){
            lastTools.unshift(tool)
            localStorage.setItem('@last_tools', JSON.stringify(lastTools.slice(0, 3)))
        }
     }
 });

 const getLastTools = () => {
    let lastTools = localStorage.getItem('@last_tools') || '[]'
    return JSON.parse(lastTools)
 }

const showTools = (tools) => {
    results.innerHTML = '';
    tools.map(tool => results.innerHTML += `
        <a class="tool-item open-modal" title="${tool.name}" href="/" data-open="${tool.app_id}" style="background-color:${tool.color}">
            <div id="${tool.app_id}" class="single-item" data-open="${tool.app_id}">
                <img class="tool-icon" src="${tool.icon}" alt="${tool.name}" data-open="${tool.app_id}">
                <p class="item-name" data-open="${tool.app_id}">${tool.name}</p>
            </div>
        </a>       
        `
    )
}