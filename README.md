# Hospital-Management-System


This project is made using Node js , Express , ejs , html , css , javascript , jquery and the database used is MySQL. So make sure you have these installed in your system.

First download the zip file and extract it. Then you would need to import the databases to your MySQL workbench. The database are stored in the folder named Databases.

After this make sure to change the password and database name for the successfull connection to the database according to you. This you will need to set in two files one is app.js and the other is passport.js (this is inside the config folder). 

Now open the terminal and change the working directory to the extracted folder location and then type the following commands :

1. npm init -y (this will initialize the package.json file in the root directory of your node with the default specifications)
2. npm install (this will install the dependencies in the local node_modules folder)
3. node app.js (to run the project on the server)
  
If everything is fine then the console should display the following message : 
"server is running on port 8080
 Mysql connected!"

If the above message is not displayed then there is some error. Check if all the required packages are installed correctly and all the tables are imported successfully and run again using the commanf node app.js.

Once this is done now open your browser and go to URL localhost:8080.

This will display the login/register page. 

One important thing to take care while registering a new user is make sure that while entering the email id their domain name must be the same as their position. 
Example : If a new user has Name as Aibileen Clark and she is joining as a receptionist then her email id needs to be clark@managmenet.com.
Similary if it is doctor then clark@doctor.com , for pharmacist clark@pharmacy.com , for laboratory clark@laboratory.com and for accoutant clark@accounant.com.
If this is not done then the user on logging in again will not be redirected to the correct page as the code follows the above format.
The general format which we used for the  storing email (which will be used for logging in) and passwords are as follows :
email : surname@position.com
password : surname@123.

And this login/register is only for the people working in the hospital. The patients will be registered by the receptionist.

After successfully logging in the user will be redirected to different pages depending upon their positions. 


