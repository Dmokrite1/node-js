CREATE ACTIVITY:

Invoke-RestMethod -Uri 'http://localhost:8001/activities' -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name": "Traveling", "description": "A travel to New-York."}'

READ ACTIVITY:

Invoke-RestMethod -Uri 'http://localhost:8001/activities' -Method GET

UPDATE ACTIVITY:

Invoke-RestMethod -Uri 'http://localhost:8001/activities/3' -Method PUT -Headers @{"Content-Type"="application/json"} -Body '{"name": "Updated Activity", "description": "add a new activity"}'

DELETE ACTIVITY:

Invoke-RestMethod -Uri "http://localhost:8001/activities/2" -Method Delete

CREATE USER:

Invoke-RestMethod -Uri 'http://localhost:8001/users' -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username": "Redha_Francis", "email": "Redha.Francis@example.com"}'

READ USER:

Invoke-RestMethod -Uri 'http://localhost:8001/users' -Method GET

UPDATE USER:

Invoke-RestMethod -Uri 'http://localhost:8001/users/1' -Method PUT -Headers @{"Content-Type"="application/json"} -Body '{"username": "Jacques_Ouille", "email": "Jackes.ouille@example.com"}'

DELETE USER:

Invoke-RestMethod -Uri "http://localhost:8001/users/1" -Method Delete