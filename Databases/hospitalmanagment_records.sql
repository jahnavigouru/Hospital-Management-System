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
-- Table structure for table `records`
--

DROP TABLE IF EXISTS `records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `records` (
  `doa` varchar(255) DEFAULT NULL,
  `p_id` int DEFAULT NULL,
  `d_id` int DEFAULT NULL,
  `meds` varchar(255) DEFAULT NULL,
  `prescription` varchar(255) DEFAULT NULL,
  `LabTests` varchar(255) DEFAULT NULL,
  KEY `d_id` (`d_id`),
  KEY `p_id` (`p_id`),
  CONSTRAINT `d_id` FOREIGN KEY (`d_id`) REFERENCES `diseases` (`d_id`),
  CONSTRAINT `p_id` FOREIGN KEY (`p_id`) REFERENCES `patient_info` (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `records`
--

LOCK TABLES `records` WRITE;
/*!40000 ALTER TABLE `records` DISABLE KEYS */;
INSERT INTO `records` VALUES ('08-06-2020',9,1,'Dolo 650-1-0-1 for 5 days,Adderall-0-1-0 for 2 days,','Very Bad,\r\nvisit after 3 days','Blood Test'),('08-06-2020',10,1,NULL,'NA',NULL),('11-06-2020',10,1,NULL,'NA',NULL),('22-06-2020',11,1,'Adderall-1-0-1,Adderall-1-0-0,','NA','Blood Test,Liver Function Tests,MRI'),('23-06-2020',11,1,'N-undefined,A-undefined,','','Blood Test,Liver Function Tests,MRI'),('24-06-2020',11,1,'N-undefined,A-undefined,','','Blood Test'),('24-06-2020',11,2,'N-undefined,A-undefined,','','Blood Test'),('24-06-2020',11,3,'N-undefined,A-undefined,','','Blood Test'),('24-06-2020',9,1,'N-undefined,A-undefined,','','Liver Function Tests,Blood Test');
/*!40000 ALTER TABLE `records` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-24 13:18:36
