-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: hospital_management
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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `UserType` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `DOB` varchar(255) DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `Date_joining` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aibileen Clark','Receptionist','NA','20-03-1986',36,'Female','The Help','22-03-2019','9876543210','clark@management.com','$2a$10$VFsKjfNGR6cbZswWJKvHqeeaMmjH7hKGeNw0TK/kaZA6jz/eqnBYW'),(2,'Larry Riggs','Receptionist','NA','22-09-1980',40,'Male','Battle Of The Sexes','20-04-2019','9087654321','riggs@management.com','$2a$10$P/A..uk.qGakroT5sJGu7.K8VbIbPyZ0xSE0KDkgHtkTXcAMCHATi'),(3,'Elizabeth Bennet','Doctor','1','08-01-1990',30,'Female','Pride And Prejudice','18-12-2019','9807654321','bennet@doctor.com','$2a$10$oLHypAZhJo9fs6XdWaXIRuIowCyvSepNHWOpDwtzkATrwr4XvMJJy'),(4,'Fitzwilliam Darcy','Doctor','2','23-04-1987',33,'Male','Pride And Prejudice','27-05-2019','9786543210','darcy@doctor.com','$2a$10$eI.pOuS1jnZdd3xWGeXoIeAv7eaNK1R8EPmmoiTxP5RbtPZonjX0y'),(5,'Amy','Accountant','NA','11-11-1992',28,'Female','Gone Girl','03-02-2019','9687543210','amy@accountant.com','$2a$10$Gb9A6LRhwxXrRn2z/WhCPekIj1GenPfF6fKR91OaR8OW5MWS//1HC'),(6,'Cliff Patel','Doctor','3','08-08-1969',51,'Male','Silver Linings Playbook','08-01-2018','6543217890','patel@doctor.com','$2a$10$/sRYmAQjudpuhBonkiNyFuEuHEu9ysnmSPBFbmBxsEk8NpTh7QnNu');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-01 14:30:26
