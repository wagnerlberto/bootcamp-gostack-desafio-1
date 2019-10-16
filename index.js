const express = require('express');

const app = express();

app.use(express.json());

const projects = [];
reqQtty = 0;

/* middleware utilizado em todas rotas 
  que recebem 
  o ID do projeto nos parâmetros da URL 
  que verifica se o projeto com aquele ID 
  existe. 
  Se não existir retorne um erro, 
  caso contrário 
  permita a requisição continuar normalmente
*/
function checkProjectExistence(req, res, next){
  const { id } = req.params;

  const theProject = projects.find(i => i.id == id);

  if(!theProject){
    return res.status(400).json({ error: 'Project id was not found'});
  }else
    return next();
}

/* middleware global 
  chamado em todas requisições 
  que imprime (console.log) 
  uma contagem de requisições 
  feitas na aplicação até então;
*/
app.use((req, res, next) => {
  reqQtty++;

  console.log(`Quantidade de requisições até o momento: ${reqQtty}`);
  
  return next();
});
  
/* POST /projects: 
  A rota deve receber id e title 
  dentro corpo e cadastrar um novo projeto 
  dentro de um array no seguinte formato: 
  { id: "1", title: 'Novo projeto', tasks: [] }; 
  Certifique-se de enviar tanto o ID 
  quanto o título do projeto no formato 
  string com àspas duplas.
*/
app.post('/projects',
          (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const tasks = [];

  projects.push({id,title,tasks});

  return res.send();
});

/* GET /projects: 
  Rota que lista todos projetos e suas tarefas
*/
app.get('/projects', (req, res) => {
  return res.json(projects);
});

/* PUT /projects/:id: 
  A rota deve alterar apenas 
  o título do projeto com o id presente 
  nos parâmetros da rota;
*/
app.put('/projects/:id',  
          checkProjectExistence,
          (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const theProject = projects.find(i => i.id == id);

  theProject.title = title;  

  return res.send();
});

/* DELETE /projects/:id: 
  A rota deve deletar o projeto 
  com o id presente nos parâmetros da rota;
*/
app.delete('/projects/:id',  
            checkProjectExistence,
            (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(i => i.id == id);

  projects.splice(index, 1);

  return res.send();
});

/* POST /projects/:id/tasks: 
  A rota deve receber 
  um campo title 
  e armazenar uma nova tarefa 
  no array de tarefas 
  de um projeto específico 
  escolhido através do id 
  presente nos parâmetros da rota;
*/
app.post('/projects/:id/tasks',  
          checkProjectExistence,
          (req, res) => {
  const { id } = req.params;
  const { taskTitle } = req.body;

  const theProject = projects.find(i => i.id == id);

  theProject.tasks.push(taskTitle);  

  return res.send();
});

app.listen(4000);
