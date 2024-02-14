import * as http from 'http';
import * as fs from 'fs';

const port = 8001;

const activities: any[] = [];
const users: any[] = [];
let lastActivityId = 0;
let lastUserId = 0;
loadData();

const server = http.createServer((req, res) => {
    
  const urlParts = req.url?.split('/');
  const resource = urlParts ? urlParts[1] : '';

  if (resource === 'activities' && req.method === 'POST') {
    createActivity(req, res);
  } else if (resource === 'activities' && req.method === 'GET') {
    getActivities(req, res);
  } else if (resource === 'activities' && req.method === 'PUT') {
    updateActivity(req, res);
  } else if (resource === 'activities' && req.method === 'DELETE') {
    deleteActivity(req, res);
  } else if (resource === 'users' && req.method === 'POST') {
    createUser(req, res);
  } else if (resource === 'users' && req.method === 'GET') {
    getUsers(req, res);
  } else if (resource === 'users' && req.method === 'PUT') {
    updateUser(req, res);
  } else if (resource === 'users' && req.method === 'DELETE') {
    deleteUser(req, res);
  } else if (resource === 'help' && req.method === 'GET') {
    help(req, res);
  }else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

function loadData() {
  try {
    const usersData = fs.readFileSync('users.json', 'utf8');
    users.push(...JSON.parse(usersData));
  } catch (error) {
    console.error('Error loading users data:', error);
  }

  try {
    const activitiesData = fs.readFileSync('activities.json', 'utf8');
    activities.push(...JSON.parse(activitiesData));
    activities.forEach(activity => {
      lastActivityId = Math.max(lastActivityId, activity.id);
    });
  } catch (error) {
    console.error('Error loading activities data:', error);
  }
}

function saveData() {
  try {
    fs.writeFileSync('users.json', JSON.stringify(users), 'utf8');
  } catch (error) {
    console.error('Error saving users data:', error);
  }

  try {
    fs.writeFileSync('activities.json', JSON.stringify(activities), 'utf8');
  } catch (error) {
    console.error('Error saving activities data:', error);
  }
}

function help(req: http.IncomingMessage, res: http.ServerResponse) {
  // Page HTML expliquant le fonctionnement de votre API
  const htmlContent = `
    <html>
      <head>
        <title>API Help</title>
      </head>
      <body>
        <h1>Welcome to the API Help Page</h1>
        <h3>This is a simple API with CRUD operations for activities and users.</h3>
        <h2>Activities:</h2>
        <h3>
          Create: POST http://localhost:8001/activities;
          Read: GET http://localhost:8001/activities;
          Update: PUT http://localhost:8001/activities/:id;
          Delete: DELETE http://localhost:8001/activities/:id;
        </h3>
        <h2>Users:</h2>
        <h3>
          Create: POST http://localhost:8001/users;
          Read: GET http://localhost:8001/users;
          Update: PUT http://localhost:8001/users/:id;
          Delete: DELETE http://localhost:8001/users/:id;
        </h3>
        <h2>Help:</h2>
        <h3>
          Help Page: GET http://localhost:8001/help;
        </h3>
      </body>
    </html>
  `;
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
}

function createActivity(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';
  
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const activityData = JSON.parse(body);

      const newActivity = {
        id: ++lastActivityId,  // Incrémentation de l'identifiant
        name: activityData.name,
        description: activityData.description,
      };

      activities.push(newActivity);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity created', data: newActivity }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
  saveData();
}

function getRecentActivities(userId: string): string[] {
  
  const userRecentActivities = new Map<string, string[]>();
  const recentActivities = userRecentActivities.get(userId) || [];
  
  return recentActivities;
}

function getActivityById(activityId: string): any | undefined {
  // Recherche de l'activité par son ID dans la liste fictive
  return activities.find(activity => activity.id.toString() === activityId);
}
 
function getActivities(req: http.IncomingMessage, res: http.ServerResponse) {
  const userId = req.url?.split('?')[1]?.split('=')[1];
  const activityId = req.url?.split('/')[2];

  if (req.method === 'DELETE' && activityId) {
    // Logique pour supprimer une activité
    deleteActivity(req, res);
  } else if (activityId) {
    // Logique pour obtenir une activité spécifique par son ID
    const activity = getActivityById(activityId);

    if (activity) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity details', data: activity }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity not found' }));
    }
  } else if (userId) {
    // Logique pour proposer une activité le dimanche
    const recentActivities = getRecentActivities(userId);
    const availableActivities = activities.filter(activity => !recentActivities.includes(activity.id));

    if (availableActivities.length > 0) {
      const randomActivity = availableActivities[Math.floor(Math.random() * availableActivities.length)];

      // Mettez à jour la carte des activités récentes de l'utilisateur
      const userRecentActivities = new Map<string, string[]>();
      const userActivities = userRecentActivities.get(userId) || [];
      userActivities.push(randomActivity.id);
      userRecentActivities.set(userId, userActivities);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Proposed Sunday activity', data: randomActivity }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'No available activities for this user on Sunday' }));
    }
  } else {
    // Logique pour obtenir toutes les activités
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ activities: activities }));
  }
}
 
function updateActivity(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';
  const urlParts = req.url?.split('/');
  const activityId = urlParts ? urlParts[2] : '';

  req.on('data', (chunk) => {
      body += chunk.toString();
  });

  req.on('end', () => {
    console.log('Received body:', body); // Ajoutez ceci pour voir le corps de la requête dans la console
    try {
      const updatedActivityData = JSON.parse(body);
      console.log('Parsed JSON:', updatedActivityData); // Ajoutez ceci pour voir l'objet JSON parsé dans la console

      // Recherche de l'activité avec l'ID correspondant dans la liste
      const index = activities.findIndex(activity => activity.id.toString() === activityId);

      if (index !== -1) {
        // Mise à jour des propriétés de l'activité
        activities[index].name = updatedActivityData.name || activities[index].name;
        activities[index].description = updatedActivityData.description || activities[index].description;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Activity updated', data: activities[index] }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Activity not found' }));
      }
    } catch (error) {
      console.log('Error parsing JSON:', error); // Ajoutez ceci pour voir les erreurs de parsing JSON dans la console
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
  saveData();
}

function deleteActivity(req: http.IncomingMessage, res: http.ServerResponse) {
  const urlParts = req.url?.split('/');
  const activityId = urlParts ? urlParts[2] : '';

  if (activityId) {
    // Recherche de l'index de l'activité avec l'ID correspondant dans la liste
    const index = activities.findIndex(activity => activity.id.toString() === activityId);

    if (index !== -1) {
      // Suppression de l'activité de la liste
      const deletedActivity = activities.splice(index, 1)[0];

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity deleted', data: deletedActivity }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity not found' }));
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Missing activity ID' }));
  }
  saveData();
}

function createUser(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const userData = JSON.parse(body);

      const newUser = {
        id: ++lastUserId,  // Incrémentation de l'identifiant
        username: userData.username,
        email: userData.email,
      };

      users.push(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User created', data: newUser }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
  saveData();
}

function getUsers(req: http.IncomingMessage, res: http.ServerResponse) {
  const urlParts = req.url?.split('/');
  const userId = urlParts ? urlParts[2] : '';

  if (userId) {
    // Récupération d'un utilisateur par son ID
    const user = users.find(user => user.id === parseInt(userId));

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user: user }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    // Récupération de la liste complète des utilisateurs
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users: users }));
  }
}

function updateUser(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';
  const urlParts = req.url?.split('/');
  const userId = urlParts ? urlParts[2] : '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    console.log('Received body:', body); // Ajoutez ceci pour voir le corps de la requête dans la console
    try {
      const updatedUserData = JSON.parse(body);
      console.log('Parsed JSON:', updatedUserData); // Ajoutez ceci pour voir l'objet JSON parsé dans la console

      // Recherche de l'index de l'utilisateur avec l'ID correspondant dans la liste
      const index = users.findIndex(user => user.id === parseInt(userId));

      if (index !== -1) {
        // Mise à jour des propriétés de l'utilisateur
        users[index].username = updatedUserData.username || users[index].username;
        users[index].email = updatedUserData.email || users[index].email;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User updated', data: users[index] }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } catch (error) {
      console.log('Error parsing JSON:', error); // Ajoutez ceci pour voir les erreurs de parsing JSON dans la console
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
  saveData();
}

function deleteUser(req: http.IncomingMessage, res: http.ServerResponse) {
  const urlParts = req.url?.split('/');
  const userId = urlParts ? urlParts[2] : '';
  
  // Recherche de l'index de l'utilisateur avec l'ID correspondant dans la liste fictive
  const index = users.findIndex(user => user.id === parseInt(userId));
  
  if (index !== -1) {
    // Suppression de l'utilisateur de la liste fictive
    const deletedUser = users.splice(index, 1)[0];
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User deleted', data: deletedUser }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
  saveData();
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
*commenté
*/

/*
// Importation des modules http et fs
import * as http from 'http';
import * as fs from 'fs';

// Définition du port
const port = 8001;

// Initialisation des listes d'activités et d'utilisateurs ainsi que des compteurs d'ID
const activities: any[] = [];
const users: any[] = [];
let lastActivityId = 0;
let lastUserId = 0;

// Chargement des données depuis les fichiers JSON
loadData();

// Création du serveur HTTP
const server = http.createServer((req, res) => {
  // Extraction de la partie de l'URL correspondant à la ressource demandée
  const urlParts = req.url?.split('/');
  const resource = urlParts ? urlParts[1] : '';

  // Routage en fonction de la ressource et de la méthode HTTP
  if (resource === 'activities' && req.method === 'POST') {
    createActivity(req, res);
  } else if (resource === 'activities' && req.method === 'GET') {
    getActivities(req, res);
  } else if (resource === 'activities' && req.method === 'PUT') {
    updateActivity(req, res);
  } else if (resource === 'activities' && req.method === 'DELETE') {
    deleteActivity(req, res);
  } else if (resource === 'users' && req.method === 'POST') {
    createUser(req, res);
  } else if (resource === 'users' && req.method === 'GET') {
    getUsers(req, res);
  } else if (resource === 'users' && req.method === 'PUT') {
    updateUser(req, res);
  } else if (resource === 'users' && req.method === 'DELETE') {
    deleteUser(req, res);
  } else if (resource === 'help' && req.method === 'GET') {
    help(req, res);
  } else {
    // Réponse pour les routes non trouvées
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

// Chargement initial des données depuis les fichiers JSON
function loadData() {
  try {
    const usersData = fs.readFileSync('users.json', 'utf8');
    users.push(...JSON.parse(usersData));
  } catch (error) {
    console.error('Error loading users data:', error);
  }

  try {
    const activitiesData = fs.readFileSync('activities.json', 'utf8');
    activities.push(...JSON.parse(activitiesData));
    activities.forEach(activity => {
      lastActivityId = Math.max(lastActivityId, activity.id);
    });
  } catch (error) {
    console.error('Error loading activities data:', error);
  }
}

// Sauvegarde des données dans les fichiers JSON
function saveData() {
  try {
    fs.writeFileSync('users.json', JSON.stringify(users), 'utf8');
  } catch (error) {
    console.error('Error saving users data:', error);
  }

  try {
    fs.writeFileSync('activities.json', JSON.stringify(activities), 'utf8');
  } catch (error) {
    console.error('Error saving activities data:', error);
  }
}

// Page d'aide expliquant le fonctionnement de l'API
function help(req: http.IncomingMessage, res: http.ServerResponse) {
  const htmlContent = `
    <html>
      <head>
        <title>API Help</title>
      </head>
      <body>
        <h1>Welcome to the API Help Page</h1>
        <h3>This is a simple API with CRUD operations for activities and users.</h3>
        <h2>Activities:</h2>
        <h3>
          Create: POST http://localhost:8001/activities;
          Read: GET http://localhost:8001/activities;
          Update: PUT http://localhost:8001/activities/:id;
          Delete: DELETE http://localhost:8001/activities/:id;
        </h3>
        <h2>Users:</h2>
        <h3>
          Create: POST http://localhost:8001/users;
          Read: GET http://localhost:8001/users;
          Update: PUT http://localhost:8001/users/:id;
          Delete: DELETE http://localhost:8001/users/:id;
        </h3>
        <h2>Help:</h2>
        <h3>
          Help Page: GET http://localhost:8001/help;
        </h3>
      </body>
    </html>
  `;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
}

// Fonction pour créer une nouvelle activité
function createActivity(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';

  // Écoute des données de la requête
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  // Traitement des données une fois la requête terminée
  req.on('end', () => {
    try {
      const activityData = JSON.parse(body);

      // Création d'une nouvelle activité avec un nouvel ID
      const newActivity = {
        id: ++lastActivityId,
        name: activityData.name,
        description: activityData.description,
      };

      // Ajout de la nouvelle activité à la liste
      activities.push(newActivity);

      // Réponse avec succès
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity created', data: newActivity }));
    } catch (error) {
      // Réponse en cas de format JSON invalide
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });

  // Sauvegarde des données mises à jour
  saveData();
}

function getActivities(req: http.IncomingMessage, res: http.ServerResponse) {
  // Extraction des paramètres de l'URL
  const userId = req.url?.split('?')[1]?.split('=')[1];
  const activityId = req.url?.split('/')[2];

  // Vérification de la méthode HTTP pour déterminer le type de requête
  if (req.method === 'DELETE' && activityId) {
    // Si la méthode est DELETE et un ID d'activité est fourni, déclencher la logique de suppression
    deleteActivity(req, res);
  } else if (activityId) {
    // Si un ID d'activité est fourni, déclencher la logique pour obtenir les détails de cette activité
    const activity = getActivityById(activityId);

    // Vérification si l'activité existe
    if (activity) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity details', data: activity }));
    } else {
      // Répondre avec un statut 404 si l'activité n'est pas trouvée
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity not found' }));
    }
  } else if (userId) {
    // Si un ID d'utilisateur est fourni, déclencher la logique pour proposer une activité le dimanche
    const recentActivities = getRecentActivities(userId);
    const availableActivities = activities.filter(activity => !recentActivities.includes(activity.id));

    if (availableActivities.length > 0) {
      // Si des activités sont disponibles, en choisir une au hasard
      const randomActivity = availableActivities[Math.floor(Math.random() * availableActivities.length)];

      // Mettre à jour la carte des activités récentes de l'utilisateur
      const userRecentActivities = new Map<string, string[]>();
      const userActivities = userRecentActivities.get(userId) || [];
      userActivities.push(randomActivity.id);
      userRecentActivities.set(userId, userActivities);

      // Répondre avec la proposition d'activité pour le dimanche
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Proposed Sunday activity', data: randomActivity }));
    } else {
      // Répondre si aucune activité n'est disponible pour cet utilisateur le dimanche
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'No available activities for this user on Sunday' }));
    }
  } else {
    // Si aucun ID d'activité ni d'utilisateur n'est fourni, obtenir la liste de toutes les activités
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ activities: activities }));
  }
}

// Fonction pour mettre à jour une activité existante
function updateActivity(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';
  const urlParts = req.url?.split('/');
  const activityId = urlParts ? urlParts[2] : '';

  // Écoute des données de la requête
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  // Traitement des données une fois la requête terminée
  req.on('end', () => {
    console.log('Received body:', body); // Ajoutez ceci pour voir le corps de la requête dans la console
    try {
      const updatedActivityData = JSON.parse(body);
      console.log('Parsed JSON:', updatedActivityData); // Ajoutez ceci pour voir l'objet JSON parsé dans la console

      // Recherche de l'activité avec l'ID correspondant dans la liste
      const index = activities.findIndex(activity => activity.id.toString() === activityId);

      if (index !== -1) {
        // Mise à jour des propriétés de l'activité
        activities[index].name = updatedActivityData.name || activities[index].name;
        activities[index].description = updatedActivityData.description || activities[index].description;

        // Réponse avec succès
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Activity updated', data: activities[index] }));
      } else {
        // Réponse en cas d'activité non trouvée
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Activity not found' }));
      }
    } catch (error) {
      // Réponse en cas d'erreur de parsing JSON
      console.log('Error parsing JSON:', error); // Ajoutez ceci pour voir les erreurs de parsing JSON dans la console
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });

  // Sauvegarde des données mises à jour
  saveData();
}

// Fonction pour supprimer une activité
function deleteActivity(req: http.IncomingMessage, res: http.ServerResponse) {
  const urlParts = req.url?.split('/');
  const activityId = urlParts ? urlParts[2] : '';

  if (activityId) {
    // Recherche de l'index de l'activité avec l'ID correspondant dans la liste
    const index = activities.findIndex(activity => activity.id.toString() === activityId);

    if (index !== -1) {
      // Suppression de l'activité de la liste
      const deletedActivity = activities.splice(index, 1)[0];

      // Réponse avec succès
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity deleted', data: deletedActivity }));
    } else {
      // Réponse en cas d'activité non trouvée
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Activity not found' }));
    }
  } else {
    // Réponse en cas d'ID d'activité manquant
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Missing activity ID' }));
  }

  // Sauvegarde des données mises à jour
  saveData();
}

// Fonction pour créer un nouvel utilisateur
function createUser(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';

  // Écoute des données de la requête
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  // Traitement des données une fois la requête terminée
  req.on('end', () => {
    try {
      const userData = JSON.parse(body);

      // Création d'un nouvel utilisateur avec un nouvel ID
      const newUser = {
        id: ++lastUserId,
        username: userData.username,
        email: userData.email,
      };

      // Ajout du nouvel utilisateur à la liste
      users.push(newUser);

      // Réponse avec succès
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User created', data: newUser }));
    } catch (error) {
      // Réponse en cas de format JSON invalide
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });

  // Sauvegarde des données mises à jour
  saveData();
}

// Fonction pour obtenir la liste des utilisateurs
function getUsers(req: http.IncomingMessage, res: http.ServerResponse) {
  const urlParts = req.url?.split('/');
  const userId = urlParts ? urlParts[2] : '';

  if (userId) {
    // Récupération d'un utilisateur par son ID
    const user = users.find(user => user.id === parseInt(userId));

    if (user) {
      // Réponse avec les détails de l'utilisateur
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user: user }));
    } else {
      // Réponse en cas d'utilisateur non trouvé
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    // Récupération de la liste complète des utilisateurs
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users: users }));
  }
}

// Fonction pour mettre à jour les données d'un utilisateur
function updateUser(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';
  // Extraction de l'ID de l'utilisateur à partir de l'URL
  const urlParts = req.url?.split('/');
  const userId = urlParts ? urlParts[2] : '';

  // Écoute des données de la requête
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  // Traitement des données une fois la requête terminée
  req.on('end', () => {
    console.log('Received body:', body); // Affiche le corps de la requête dans la console
    try {
      const updatedUserData = JSON.parse(body);
      console.log('Parsed JSON:', updatedUserData); // Affiche l'objet JSON parsé dans la console

      // Recherche de l'index de l'utilisateur avec l'ID correspondant dans la liste fictive
      const index = users.findIndex(user => user.id === parseInt(userId));

      if (index !== -1) {
        // Mise à jour des propriétés de l'utilisateur
        users[index].username = updatedUserData.username || users[index].username;
        users[index].email = updatedUserData.email || users[index].email;

        // Réponse avec succès
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User updated', data: users[index] }));
      } else {
        // Réponse si l'utilisateur n'est pas trouvé
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } catch (error) {
      console.log('Error parsing JSON:', error); // Affiche les erreurs de parsing JSON dans la console
      // Réponse en cas de format JSON invalide
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
  // Sauvegarde des données mises à jour
  saveData();
}

// Fonction pour supprimer un utilisateur
function deleteUser(req: http.IncomingMessage, res: http.ServerResponse) {
  // Extraction de l'ID de l'utilisateur à partir de l'URL
  const urlParts = req.url?.split('/');
  const userId = urlParts ? urlParts[2] : '';

  // Recherche de l'index de l'utilisateur avec l'ID correspondant dans la liste fictive
  const index = users.findIndex(user => user.id === parseInt(userId));

  if (index !== -1) {
    // Suppression de l'utilisateur de la liste fictive
    const deletedUser = users.splice(index, 1)[0];

    // Réponse avec succès
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User deleted', data: deletedUser }));
  } else {
    // Réponse si l'utilisateur n'est pas trouvé
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
  // Sauvegarde des données mises à jour
  saveData();
}

// Démarrage du serveur
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

*/
