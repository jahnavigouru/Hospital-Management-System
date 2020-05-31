-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: hospitalmanagement
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `patient_info`
--

DROP TABLE IF EXISTS `patient_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_info` (
  `p_id` int NOT NULL AUTO_INCREMENT,
  `p_dor` varchar(255) DEFAULT NULL,
  `p_name` varchar(255) DEFAULT NULL,
  `p_age` int DEFAULT NULL,
  `p_gender` varchar(255) DEFAULT NULL,
  `p_dob` varchar(255) DEFAULT NULL,
  `p_bloodgrp` varchar(255) DEFAULT NULL,
  `p_phn` varchar(255) DEFAULT NULL,
  `p_addr` varchar(255) DEFAULT NULL,
  `p_emailid` varchar(255) DEFAULT NULL,
<<<<<<< HEAD:Databases/hospitalmanagement_patient_info0.sql
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
  `d_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `d_id` (`d_id`),
  CONSTRAINT `patient_info_ibfk_1` FOREIGN KEY (`d_id`) REFERENCES `diseases` (`d_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> c9fa6efb4731a0d308407b13da4ae970aab19bb4:Databases/hospitalmanagment_patient_info.sql
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_info`
--

LOCK TABLES `patient_info` WRITE;
/*!40000 ALTER TABLE `patient_info` DISABLE KEYS */;
<<<<<<< HEAD:Databases/hospitalmanagement_patient_info0.sql
INSERT INTO `patient_info` VALUES (8,'14-05-2020','Lilly',23,'Female','18-06-1998','B+',1234567890,'India','lilly@gmail.com'),(9,'30-05-2020','Robin',20,'Female','09-05-2000','O+',1234567890,'India','robin@gmail.com');
=======
INSERT INTO `patient_info` VALUES (1,'01-04-2020','Tiffiny Maxwell',25,'Female','13-07-1995','A+','7654321890',' Silver Linings Playbook','maxwell@outlook.com',2),(2,'05-03-2020','Joel Barish',37,'Male','01-02-1983','B+','7890765431','Eternal Sunshine of the Spotless Mind','barish@gmail.com',1),(3,'08-05-2020','Bobby Riggs',67,'Male','27-10-1953','A-','9876543211','Battle of the Sexes','riggs@redffmail',3),(4,'31-05-2020','John Nash',19,'Male','18-07-2001','B+','8765432199','A Beautiful Mind','nash@gmail.com',1),(5,'05-05-2020','Todd Miller',29,'Male','07-03-1991','O+','8765432190','We\'re The Millers','miller@gmail.com',2),(6,'27-04-2020','Emile Grace',56,'Female','22-06-1964','B-','8765432090','Me before you','grace@gmail.com',2),(7,'11-05-2020','Celia Foote',15,'Female','23-12-2005','O+','6789054321','The Help','foote@yahoo.com',3),(8,'06-04-2020','Eugenia Skeeter',11,'Female','20-03-2011','A+','8765432111','The Help','a@gmail.com',1),(9,'28-04-2020','Molly Bloom',32,'Female','25-05-1988','AB+','8907654321','Molly\'s Game','bloom@gmail.com',2),(10,'27-04-2020','Eugenia Skeeter',2,'Female','29-11-2018','AB-','9900223311','The Help','skeeter@gmail.com',1);
>>>>>>> c9fa6efb4731a0d308407b13da4ae970aab19bb4:Databases/hospitalmanagment_patient_info.sql
/*!40000 ALTER TABLE `patient_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

<<<<<<< HEAD:Databases/hospitalmanagement_patient_info0.sql
-- Dump completed on 2020-05-31 16:21:37
=======
-- Dump completed on 2020-05-31 16:26:16
>>>>>>> c9fa6efb4731a0d308407b13da4ae970aab19bb4:Databases/hospitalmanagment_patient_info.sql
