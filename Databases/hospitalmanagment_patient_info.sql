-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: hospitalmanagment
-- ------------------------------------------------------
-- Server version	8.0.20

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
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_info`
--

LOCK TABLES `patient_info` WRITE;
/*!40000 ALTER TABLE `patient_info` DISABLE KEYS */;
INSERT INTO `patient_info` VALUES (9,'08-06-2020','John Nash',21,'Male','15-06-1999','O+','9087654321','A Beautiful Mind','nash@gmail.com'),(10,'08-06-2020','Tiffiny Maxwell',20,'Female','13-06-2000','AB-','9876543210','Sliver Linning Palynook','maxwell@gmail.com'),(11,'22-06-2020','Broun Mars',20,'Male','09-02-2000','A+','9999999999','It Will Rain','mars@gmal.com');
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

-- Dump completed on 2020-06-25 14:00:32
