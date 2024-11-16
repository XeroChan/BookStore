# Game Store API

## VS Code commands

ctrl+shift+b - build project // dotnet build - builds project
ctrl + . - quick fix
ctrl + space - check other parameters
ctrl+j - terminal
ctrl_shift+p - command palette
f2 - renames variable

## Staring SQL Server

```powershell
$sa_password = "Pass@word123"
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=$sa_password" -p 1433:1433 -v sqlvolume:/var/opt/mssql -d --rm --name mssql mcr.microsoft.com/mssql/server:2022-latest
```
-d - detached mode = no logs
-v - create volume for the sql data so when container is stopped/removed the data persists
--rm - anytime docker container is stopped it is automatically removed
--name - specify container name

## Docker commands

docker ps - list containers
docker stop mssql - stops the container

## Setting the connection string to secret manager
### season 5 ep 6 time 00:41
dotnet user-secrets init
dotnet user-secrets list - check secrets
```powershell
$sa_password = "Pass@word123"
dotnet user-secrets set "ConnectionStrings:BookStoreContext" "Server=localhost; Database=BookStore; User Id=sa; Password=$sa_password; TrustServerCertificate=True"
```
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design

## Create token for api
```powershell
dotnet user-jwts create

dotnet user-jwts print 8025c6e6 - view full token info
```

## Add scopes to token
```powershell
dotnet user-jwts create --scope "store:read"
```

## Create token for roles
```powershell
dotnet user-jwts create --role "Admin" 
```

## Merged scope and role
```powershell
dotnet user-jwts create --role "Admin" --scope "store:write"
```