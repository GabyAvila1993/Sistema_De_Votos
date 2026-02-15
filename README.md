<!-- Frontend -->
* Instalamos React con Vite para el Frontend
    1 - npm create vite@latest
        Frontend // llamamos a la carpeta Frontend
        React // Elegimos la librería
        TypeScript + SWC // Elegimos nuestro lenguaje
        npm install // colamos que sí a la instalación

<!-- backend -->

* Instalamos NestJs con TypeScript para nuestro backend
    1 - npm install @nestjs/cli
    2 - nest new backend // colocamos el nombre del proyecto en este caso va a ser backend
        npm // elegimos npm

 <!-- ATENCIÓN INICIAN DATOS IMPORTANTES DEL BACKEND -->

* Al inicializar nest como cliente se crea una carpeta en la raiz del proyecto de node_module y un package.json, si esto ocurre y lo debemos eliminar para poder subir nuestro proyecto para eso utilizamos estos comandos:

    3 - Remove-Item -Recurse -Force node_modules
    4 - Remove-Item package.json, package-lock.json

* Una vez eliminados ese problema, NestJs suele inicializar git en el backend entonces si nosotros solo lo queremos tener en el sistema principal a git (es decir en la raiz del proyecto) lo que debemos hacer es eliminar esa sub rama que se arma en el backend para eso utilizamos el siguiente comando:
    5 - Remove-Item -Recurse -Force backend\.git

* Al haber solucionado esos pasos, lo que nos queda es guardar todo para ello utilizamos los comandos de git:
    6 - git add .
    7 - git commit -m "Nombre del commit" 
    8 - git status <!-- Verificamos que todo este en orden -->
    9 - git push origin main <!-- Subimos el código al repo --> 

 <!-- ATENCIÓN FINALIZAN DATOS IMPORTANTES DEL BACKEND -->


<!-- Prisma -->

* Iniciamos Prisma para molder nuestra base de datos, en este caso usaremos MySQL (TODO DENTRO DE NUESTRO BACKEND)
* En Workbench solamente ejecutamos el comando para crear nuestra base de datos:
    10 - create database nombre_de_la_base_de_datos

* Luego de la creación de la base de datos en workbench volvemos a VSC  y ejecutamos los siguientes comandos:
    11 - npm install prisma @types/node --save-dev
    12 - npm install @prisma/client @prisma/adapter-mariadb dotenv
    13 - npx prisma init --datasource-provider mysql

* Luego modificamos nuestro archivo .env que se encuentra en la carpeta de backend, allí tendremos los datos para conectarnos a nuestra base de datos por ejemplo:

    DATABASE_URL="mysql://johndoe:randompassword@localhost:3306/mydb"

* Siguiente paso configuramos nuestro archivo schema.prisma con los modelos de las tablas que vamos a tener en nuestra base de datos, paso que sigue es utilizar el comando de migrate para que ese esquema se vaya a nuestra base de datos
    14 - npx prisma migrate dev --name init_evote

* Finalnalmente podemos generar nuestros módulos y servicios para que NestJs pueda usar esta base de datos, para ello tenemos dos opciones:

    OPCIÓN 1 = utilizamos los siguientes comandos:
        
        * nest g module prisma
        * nest g service prisma
        <!-- Esto genera otra carpeta llamada prisma con 3 archivos dentro de ella, lo recomendable es tener todo bajo una misma carpeta por lo que lo llevamos a lacarpeta de prisma donde tenemos nuestro schema.prisma -->

    OPCIÓN 2 = crear los archivos manualmente dentro de la carpeta prisma:

        * prisma.module.ts
        * prisma.service.spec.ts
        * prisma.service.ts

* Configuramos prisma.service.ts y tambien prisma.module.ts una vez configurado, en la terminal colocamos el siguiente comando:
    15 - nest g resource elections
    <!-- Este comando nos va a generar un módulo llamado elections schematic resource crea la estructura básica para un módulo que sigue el patrón CRUD (Create, Read, Update, Delete). Es decir, va a preparar todo lo necesario para manejar una entidad en tu aplicación -->
    Elegimos REST API y colocamos que sí y para que nos haga el crud

* Utilizar este comando para probar prisma en el localhost:5555 
    16 - npx prisma studio

* Probar en postman