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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `UserType` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `DOB` varchar(255) DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `Date_joning` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aibileen Clark','Receptionist',NULL,'NA','20-03-1986',36,'The Help','22-03-2019','9876543210','clark@management.com','$2a$10$G7w6DBtR4mRjp9yghiwD7e.74g6CayNKDeXDw0JLEsD/F74F42lmO'),(2,'Larry Riggs','Receptionist',NULL,'NA','22-09-1980',40,'Battle Of The Sexes','20-04-2019','9087654321','riggs@management.com','$2a$10$gCz.wayKSpEgt6VE1uVDF.L3VeoiLhzRrMCJIyH08oP3PhPSPWU0O'),(3,'Elizabeth Bennet','Doctor',NULL,'Physician','08-01-1990',30,'Pride And Prejudice','18-12-2019','9807654321','bennet@doctor.com','$2a$10$pg/5IjcUVE/yy.W.oT4sw.9Toq7HqLy3bytH8v6067Y2e.NjVT3Ra'),(4,'Fitzwilliam Darcy','Doctor',NULL,'Neurosurgeon','23-04-1987',33,'Pride And Prejudice','27-05-2019','9786543210','darcy@doctor.com','$2a$10$pDJDqsNpVmwM.fU3bI40WOynPiok7isJHKkiqOZ.kp4D14pSSB6XS'),(5,'Amy','Pharmacist',NULL,'NA','11-11-1992',28,'Gone Girl','03-02-2019','9687543210','amy@pharmacy.com','$2a$10$dnPohBat31621tY.Sx1KROLQyzgF8Eq3w47PaN9rhVIZzJZnhMYsW'),(6,'Cliff Patel','Psychiatrist',NULL,'Mentalist','08-08-1969',51,'Silver Linings Playbook','08-10-2018','6543217890','patel@doctor.com','$2a$10$4S2EZYEgeAB3FmiE.6zOAeK4Nu12DqYaEcsPoXSJ8UNm1pG4OSMp2'),(7,'David Clark','Doctor','Male','ENT','09-06-1964',56,'We\'re The Millers','18-03-2004','6688441155','clark@doctor.com','$2a$10$J5fMztRCB4CbHnKXEucp8Ocobiknx1jFQm0pkaZi3P2UvCUHB1hhS'),(8,'Furiosa','Doctor','Female','Orthopedician','15-08-1969',51,'Mad Max: Fury Road','26-11-2009','7733119900','furiosa@doctor.com','$2a$10$.ox6.VfZrWFm8uWqlWpike9k8ObJ9HPp3FG8MkBSOb81sKKBOait6'),(9,'Bud White','Lab','Male','NA','22-06-1989',31,'LA confidential ','05-12-2013','9090909090','white@laboratory.com','$2a$10$g7sLFhYZcEmVrC4LTGijjeR1BgY2MtHSK66ttvITwXIdaCnGZc2G.'),(10,'Dot','IPD','Female','NA','06-06-1989',31,'The Fundamentals of Caring','01-06-2020','9381850444','dot@IPD.com','$2a$10$zPzMCU80MW5bOv5XomnwEOGFCsmLz4FIimOHNVD2cLb6dw7LCr9Dy');
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

-- Dump completed on 2020-06-27  9:51:13
