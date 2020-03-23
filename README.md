# GoodForMoo

This is an order management system consisting of a back-end and front-end.The backend is based on ODATA RESTful API based on  ASP.Net Core 3.1
with a MSSQL Server database.The database consists of 4 tables,namely Customers, Products, Orders, OrderDetails.Data access is based on Entity Framework 3.1 code first.Entity Framework code first and migrations were used to design the database.

The front-end is React based and communicates with the back-end using ODATA.The client code resides in the ClientApp folder.
To make the client work, CD into the ClientApp folder and run yarn install or npm install.Make sure node.js, yarn or npm is installed on you computer.To run the client, run yarn start or npm start.

To make the backend run, CD into the GoodForMoo folder and issue the dotnet restore command.Make sure the dotnet client app is installed first.Run the migrations in the migrations folder.The MSSQL server should me running on your system or remotely.Remember to change the MSSQL server connection string to point to were your database server is running.
To run the back-end, issue the dotnet run command or use Visual Studio 2019.Make sure ASP.Net Core is installed on your system.
