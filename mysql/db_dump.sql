CREATE DATABASE  IF NOT EXISTS `democredit` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `democredit`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: democredit
-- ------------------------------------------------------
-- Server version	8.1.0

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
-- Table structure for table `currency`
--

DROP TABLE IF EXISTS `currency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currency` varchar(255) DEFAULT NULL,
  `value_per_dollar` float DEFAULT NULL,
  `last_update` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currency`
--

LOCK TABLES `currency` WRITE;
/*!40000 ALTER TABLE `currency` DISABLE KEYS */;
/*!40000 ALTER TABLE `currency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_default_recipient`
--

DROP TABLE IF EXISTS `customer_default_recipient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_default_recipient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `transfer_recipient_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_customer_default_recipient_user1_idx` (`user_id`),
  KEY `fk_customer_default_recipient_transfer_recipient1_idx` (`transfer_recipient_id`),
  CONSTRAINT `fk_customer_default_recipient_transfer_recipient1` FOREIGN KEY (`transfer_recipient_id`) REFERENCES `transfer_recipient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_customer_default_recipient_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_default_recipient`
--

LOCK TABLES `customer_default_recipient` WRITE;
/*!40000 ALTER TABLE `customer_default_recipient` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_default_recipient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wallet_id` varchar(255) NOT NULL,
  `transaction_id` int NOT NULL,
  `entry_type` enum('D','C') DEFAULT NULL COMMENT 'D: Debit\nC: Credit',
  `amount` decimal(10,0) DEFAULT NULL,
  `balance` decimal(10,0) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_log_wallet1_idx` (`wallet_id`),
  CONSTRAINT `fk_log_wallet1` FOREIGN KEY (`wallet_id`) REFERENCES `wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (1,'73ace0d7-c9e5-4ce2-b63b-343478a727c2',0,'',20,165,'bank transfer to AYODELE OLUWANIYI BENJAMIN 0423703103','2023-12-08 18:00:17'),(2,'73ace0d7-c9e5-4ce2-b63b-343478a727c2',4899,'',50,115,'bank transfer to AYODELE OLUWANIYI BENJAMIN 0423703103','2023-12-08 18:01:07'),(3,'73ace0d7-c9e5-4ce2-b63b-343478a727c2',9,'',30,85,'wallet transfer to Tee Johnson 4ef28a3d-2fe0-489e-bd7f-dc820509d075 on transaction 9d147c6c-e2be-48a7-a11f-91198a46f465','2023-12-08 18:11:41'),(4,'4ef28a3d-2fe0-489e-bd7f-dc820509d075',9,'',30,1260,'wallet deposit from John Doe 73ace0d7-c9e5-4ce2-b63b-343478a727c2 on transaction 9d147c6c-e2be-48a7-a11f-91198a46f465','2023-12-08 18:11:42'),(5,'73ace0d7-c9e5-4ce2-b63b-343478a727c2',0,'',30,55,'wallet transfer to Tee Johnson 4ef28a3d-2fe0-489e-bd7f-dc820509d075 on transaction ec4fd030-1991-49c1-b2b7-5e7fd3e7d152','2023-12-08 18:28:01'),(6,'4ef28a3d-2fe0-489e-bd7f-dc820509d075',0,'',30,1290,'wallet deposit from John Doe 73ace0d7-c9e5-4ce2-b63b-343478a727c2 on transaction ec4fd030-1991-49c1-b2b7-5e7fd3e7d152','2023-12-08 18:28:01'),(7,'73ace0d7-c9e5-4ce2-b63b-343478a727c2',6,'',50,5,'bank transfer to AYODELE OLUWANIYI BENJAMIN 0423703103','2023-12-08 18:28:30'),(8,'73ace0d7-c9e5-4ce2-b63b-343478a727c2',9,'',700,705,'wallet deposit from fund John Doe','2023-12-08 18:30:24');
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statement`
--

DROP TABLE IF EXISTS `statement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statement` (
  `statement_id` int NOT NULL AUTO_INCREMENT,
  `statement` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`statement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statement`
--

LOCK TABLES `statement` WRITE;
/*!40000 ALTER TABLE `statement` DISABLE KEYS */;
/*!40000 ALTER TABLE `statement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_fund`
--

DROP TABLE IF EXISTS `t_fund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_fund` (
  `transaction_id` varchar(255) NOT NULL,
  `channel` varchar(255) DEFAULT 'null',
  `authorizing_bank` varchar(255) DEFAULT 'null',
  PRIMARY KEY (`transaction_id`),
  KEY `fk_fund_transaction1_idx` (`transaction_id`),
  CONSTRAINT `fk_fund_transaction1` FOREIGN KEY (`transaction_id`) REFERENCES `transaction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_fund`
--

LOCK TABLES `t_fund` WRITE;
/*!40000 ALTER TABLE `t_fund` DISABLE KEYS */;
INSERT INTO `t_fund` VALUES ('0f1d6a75-cef4-45e0-a9fb-349071fa8917','card','TEST BANK'),('15671c80-4a6e-4e84-8d96-87175b5a47a8','card','TEST BANK'),('6cd838e8-3200-4e0c-945b-bd2c954b8ea3','card','TEST BANK'),('92902929-a47e-473a-87c9-36f3a6ae8563','card','TEST BANK'),('9b58d0d7-b623-42c9-ac59-8c33588bc657','card','TEST BANK'),('b94a9c4c-58ea-4f0c-bf38-8b06077d6747','null','null'),('bef76bb3-e44a-4c94-832c-809a08cbca7e','card','TEST BANK'),('c9f429fd-43ac-4637-ad69-4f71d04b9ef5','null','null');
/*!40000 ALTER TABLE `t_fund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_wallet2other`
--

DROP TABLE IF EXISTS `t_wallet2other`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_wallet2other` (
  `transaction_id` varchar(255) NOT NULL,
  `transfer_recipient_id` int NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `fk_T&W_transaction1_idx` (`transaction_id`),
  KEY `fk_t_wallet_to_other_transfer_recipient1_idx` (`transfer_recipient_id`),
  CONSTRAINT `fk_T&W_transaction1` FOREIGN KEY (`transaction_id`) REFERENCES `transaction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_t_wallet_to_other_transfer_recipient1` FOREIGN KEY (`transfer_recipient_id`) REFERENCES `transfer_recipient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_wallet2other`
--

LOCK TABLES `t_wallet2other` WRITE;
/*!40000 ALTER TABLE `t_wallet2other` DISABLE KEYS */;
INSERT INTO `t_wallet2other` VALUES ('0d276dfd-284f-47d5-a6be-f4cd099c42c4',1),('127925a4-aef7-49f4-a2ae-e2e33b29bb1b',1),('16790792-757e-42a3-aea2-702ce287de4c',1),('1e7794b7-1862-45c5-864e-d0f7679c1ef9',1),('2c4b28c8-8e00-45c7-9753-181cde5913cf',1),('31d9f6c0-934a-4618-acc6-5b37c3d94704',1),('38c7c2e0-addc-469d-9dc6-e98072ef5472',1),('421c2ba8-90f3-49e5-a184-1fc5ada16690',1),('4899a299-9fc1-417b-b92c-7691c0ed205a',1),('48c8744f-dbb8-4286-b4ce-43dc711a84ef',1),('527f0e53-ffbb-4d8a-9210-0d4c26de32ed',1),('54276ba2-6ce2-4f37-8d29-c696f1489fe7',1),('674a5924-ab85-41b6-b842-8e2aa4b3cdb1',1),('6ad43272-d2a1-4c1b-a746-ef9b47f80c76',1),('850d043d-7e7b-441a-8fca-473f3da4a90e',1),('8a2eb3d8-5a3f-453f-813c-40ca39322206',1),('98836bde-63f5-44d9-ba73-e06a688b84a4',1),('9fd7808c-2c17-4aef-ba5b-ca05306e9647',1),('a032717f-ca4c-496c-a4ef-fb828859bdaa',1),('b5635802-eb9a-4b57-8559-c25b522b1c78',1),('b7846592-b6b7-4ab5-a9fd-453e0e227302',1),('b841f960-32d9-4f9a-a97a-c7ebb0149650',1),('b8fff788-6dc1-4140-a655-d98fa8ad3454',1),('bb191785-c652-4129-97e2-db3998bdfbe5',1),('c744c745-8cbe-48db-924f-3bb41807aed8',1),('ce62bcc4-f13c-4a6e-8981-419f2494f77a',1),('d1e72568-c769-41bd-9a54-2e141f7c31d3',1),('d33b2c03-8752-4995-8902-3457783ff705',1),('d386012d-1c2e-48b2-92e1-3c60406f5d88',1),('dd5add21-7615-48ba-a881-c03a564f0231',1),('e74db862-16da-4215-8ac6-962754ab4dc4',1),('ea6fd403-9ad7-4b95-8758-6fc812099a54',1),('ee679ea5-43ba-4ce7-9b86-c4a23dcf75ab',1),('fe0b3479-7f72-4517-abe2-58b4c5ac6212',1);
/*!40000 ALTER TABLE `t_wallet2other` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_wallet2wallet`
--

DROP TABLE IF EXISTS `t_wallet2wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_wallet2wallet` (
  `transaction_id` varchar(255) NOT NULL,
  `receiving_wallet_id` varchar(255) NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `fk_t_wallet2wallet_transaction1_idx` (`transaction_id`),
  KEY `fk_t_wallet2wallet_wallet1_idx` (`receiving_wallet_id`),
  CONSTRAINT `fk_t_wallet2wallet_transaction1` FOREIGN KEY (`transaction_id`) REFERENCES `transaction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_t_wallet2wallet_wallet1` FOREIGN KEY (`receiving_wallet_id`) REFERENCES `wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_wallet2wallet`
--

LOCK TABLES `t_wallet2wallet` WRITE;
/*!40000 ALTER TABLE `t_wallet2wallet` DISABLE KEYS */;
INSERT INTO `t_wallet2wallet` VALUES ('9d147c6c-e2be-48a7-a11f-91198a46f465','4ef28a3d-2fe0-489e-bd7f-dc820509d075'),('a8772ba0-4263-48bd-9f2d-ea4a794f8a2f','4ef28a3d-2fe0-489e-bd7f-dc820509d075'),('d6eb1514-f851-4004-a889-1ab0029aea5a','4ef28a3d-2fe0-489e-bd7f-dc820509d075'),('ec4fd030-1991-49c1-b2b7-5e7fd3e7d152','4ef28a3d-2fe0-489e-bd7f-dc820509d075'),('0d021e78-430c-4d7b-8557-cbb84351afab','821903a5-43eb-4d7f-aeb4-e907f245f3ce'),('37cd7144-cc1b-4c0c-a4b3-0f2c36d995d0','821903a5-43eb-4d7f-aeb4-e907f245f3ce'),('3c1224fe-f51d-40a1-bbaf-5402feb14853','821903a5-43eb-4d7f-aeb4-e907f245f3ce'),('5cc77003-21f8-4034-a603-86c9858f0f83','821903a5-43eb-4d7f-aeb4-e907f245f3ce'),('aecae1a1-d3ea-409c-bf12-b165159fd507','821903a5-43eb-4d7f-aeb4-e907f245f3ce'),('cefa5202-0eba-4119-be1c-d4ee15bdfca7','821903a5-43eb-4d7f-aeb4-e907f245f3ce');
/*!40000 ALTER TABLE `t_wallet2wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` varchar(255) NOT NULL,
  `transaction_type` enum('FUND','WITHDRAW','TRANSFER') DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  `intiating_wallet` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_transaction_wallet1_idx` (`intiating_wallet`),
  CONSTRAINT `fk_transaction_wallet1` FOREIGN KEY (`intiating_wallet`) REFERENCES `wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES ('0d021e78-430c-4d7b-8557-cbb84351afab','TRANSFER',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 17:59:12','2023-10-28 17:59:12'),('0d276dfd-284f-47d5-a6be-f4cd099c42c4','WITHDRAW',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:40:17','2023-12-06 21:40:19'),('0f1d6a75-cef4-45e0-a9fb-349071fa8917','FUND',500,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 10:25:40','2023-12-06 10:26:40'),('127925a4-aef7-49f4-a2ae-e2e33b29bb1b','WITHDRAW',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:38:51','2023-12-06 21:38:52'),('15671c80-4a6e-4e84-8d96-87175b5a47a8','FUND',500,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 15:08:53','2023-10-28 15:10:06'),('16790792-757e-42a3-aea2-702ce287de4c','WITHDRAW',50,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:37:12','2023-12-06 21:37:14'),('1e7794b7-1862-45c5-864e-d0f7679c1ef9','WITHDRAW',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-07 14:28:17','2023-12-07 14:28:17'),('2bd841af-ef42-499f-8f80-292d98f8e650','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 15:22:07','2023-12-06 15:22:07'),('2c4b28c8-8e00-45c7-9753-181cde5913cf','WITHDRAW',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-07 14:06:04','2023-12-07 14:06:06'),('31d9f6c0-934a-4618-acc6-5b37c3d94704','WITHDRAW',20,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:56:42','2023-12-08 17:56:42'),('36c908ae-d6b9-45eb-8577-b8969f4de6e1','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 15:21:28','2023-12-06 15:21:28'),('37cd7144-cc1b-4c0c-a4b3-0f2c36d995d0','TRANSFER',200,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 17:43:52','2023-10-28 17:43:52'),('38c7c2e0-addc-469d-9dc6-e98072ef5472','WITHDRAW',1200,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-07 14:43:12','2023-12-07 14:43:12'),('3c1224fe-f51d-40a1-bbaf-5402feb14853','TRANSFER',225,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 17:53:02','2023-10-28 17:53:02'),('41ec62a6-8292-42d4-a3c0-2cc533983972','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 15:11:15','2023-12-06 15:11:15'),('421c2ba8-90f3-49e5-a184-1fc5ada16690','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:28:13','2023-12-06 21:28:13'),('4899a299-9fc1-417b-b92c-7691c0ed205a','WITHDRAW',50,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 18:01:05','2023-12-08 18:01:08'),('48c8744f-dbb8-4286-b4ce-43dc711a84ef','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:26:01','2023-12-06 21:26:01'),('527f0e53-ffbb-4d8a-9210-0d4c26de32ed','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:24:15','2023-12-06 21:24:15'),('54276ba2-6ce2-4f37-8d29-c696f1489fe7','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 20:44:59','2023-12-06 20:44:59'),('5cc77003-21f8-4034-a603-86c9858f0f83','TRANSFER',40,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 18:05:14','2023-10-28 18:05:14'),('674a5924-ab85-41b6-b842-8e2aa4b3cdb1','WITHDRAW',20,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:42:53','2023-12-08 17:42:54'),('6ad43272-d2a1-4c1b-a746-ef9b47f80c76','WITHDRAW',50,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 18:28:28','2023-12-08 18:28:31'),('6cd838e8-3200-4e0c-945b-bd2c954b8ea3','FUND',700,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 15:16:28','2023-10-28 15:17:20'),('850d043d-7e7b-441a-8fca-473f3da4a90e','WITHDRAW',20,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:34:31','2023-12-08 17:34:31'),('8a2eb3d8-5a3f-453f-813c-40ca39322206','WITHDRAW',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-07 14:27:35','2023-12-07 14:27:36'),('92902929-a47e-473a-87c9-36f3a6ae8563','FUND',700,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 10:17:53','2023-12-06 10:22:08'),('98836bde-63f5-44d9-ba73-e06a688b84a4','WITHDRAW',1200,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:24:43','2023-12-08 17:24:43'),('9b58d0d7-b623-42c9-ac59-8c33588bc657','FUND',700,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 18:29:40','2023-12-08 18:30:25'),('9d147c6c-e2be-48a7-a11f-91198a46f465','TRANSFER',30,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 18:11:39','2023-12-08 18:11:39'),('9fd7808c-2c17-4aef-ba5b-ca05306e9647','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:12:17','2023-12-06 21:12:17'),('a032717f-ca4c-496c-a4ef-fb828859bdaa','WITHDRAW',20,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:47:23','2023-12-08 17:47:23'),('a8772ba0-4263-48bd-9f2d-ea4a794f8a2f','TRANSFER',1200,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 10:36:32','2023-12-06 10:36:32'),('aecae1a1-d3ea-409c-bf12-b165159fd507','TRANSFER',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 17:58:10','2023-10-28 17:58:10'),('b5635802-eb9a-4b57-8559-c25b522b1c78','WITHDRAW',20,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:54:43','2023-12-08 17:54:43'),('b7846592-b6b7-4ab5-a9fd-453e0e227302','WITHDRAW',50,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:37:54','2023-12-06 21:37:55'),('b841f960-32d9-4f9a-a97a-c7ebb0149650','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:21:32','2023-12-06 21:21:32'),('b8fff788-6dc1-4140-a655-d98fa8ad3454','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 20:39:36','2023-12-06 20:39:36'),('b94a9c4c-58ea-4f0c-bf38-8b06077d6747','FUND',NULL,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 10:24:48','2023-12-06 10:24:48'),('bb191785-c652-4129-97e2-db3998bdfbe5','WITHDRAW',50,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:30:54','2023-12-06 21:30:55'),('bef76bb3-e44a-4c94-832c-809a08cbca7e','FUND',500,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-27 22:44:24','2023-10-28 13:32:53'),('c744c745-8cbe-48db-924f-3bb41807aed8','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:20:11','2023-12-06 21:20:11'),('c9f429fd-43ac-4637-ad69-4f71d04b9ef5','FUND',NULL,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 10:23:33','2023-12-06 10:23:33'),('ce62bcc4-f13c-4a6e-8981-419f2494f77a','WITHDRAW',20,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:24:56','2023-12-08 17:24:56'),('cefa5202-0eba-4119-be1c-d4ee15bdfca7','TRANSFER',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-10-28 17:55:51','2023-10-28 17:55:51'),('d1e72568-c769-41bd-9a54-2e141f7c31d3','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 15:26:30','2023-12-06 15:26:30'),('d33b2c03-8752-4995-8902-3457783ff705','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:27:18','2023-12-06 21:27:18'),('d386012d-1c2e-48b2-92e1-3c60406f5d88','WITHDRAW',20,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 18:00:16','2023-12-08 18:00:18'),('d6eb1514-f851-4004-a889-1ab0029aea5a','TRANSFER',30,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 12:16:33','2023-12-08 12:16:33'),('dd5add21-7615-48ba-a881-c03a564f0231','WITHDRAW',1150,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:30:34','2023-12-06 21:30:34'),('e74db862-16da-4215-8ac6-962754ab4dc4','WITHDRAW',20,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:39:25','2023-12-08 17:39:25'),('ea6fd403-9ad7-4b95-8758-6fc812099a54','WITHDRAW',20,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 17:45:34','2023-12-08 17:45:35'),('ec4fd030-1991-49c1-b2b7-5e7fd3e7d152','TRANSFER',30,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-08 18:27:58','2023-12-08 18:27:58'),('ee679ea5-43ba-4ce7-9b86-c4a23dcf75ab','WITHDRAW',1100,'PENDING','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-06 21:22:40','2023-12-06 21:22:40'),('fe0b3479-7f72-4517-abe2-58b4c5ac6212','WITHDRAW',10,'SUCCESS','73ace0d7-c9e5-4ce2-b63b-343478a727c2','2023-12-07 14:18:49','2023-12-07 14:18:52');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_statement`
--

DROP TABLE IF EXISTS `transaction_statement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_statement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statement` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_statement`
--

LOCK TABLES `transaction_statement` WRITE;
/*!40000 ALTER TABLE `transaction_statement` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_statement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transfer_recipient`
--

DROP TABLE IF EXISTS `transfer_recipient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfer_recipient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bank_code` varchar(255) DEFAULT NULL,
  `bank_account_name` varchar(255) DEFAULT NULL,
  `bank_account_number` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `ps_recipient_code` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfer_recipient`
--

LOCK TABLES `transfer_recipient` WRITE;
/*!40000 ALTER TABLE `transfer_recipient` DISABLE KEYS */;
INSERT INTO `transfer_recipient` VALUES (1,'058','AYODELE OLUWANIYI BENJAMIN','0423703103',NULL,'RCP_uqdpl154d4cv7gz','2023-12-06 15:11:15');
/*!40000 ALTER TABLE `transfer_recipient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('26e7af11-c572-4071-836f-808b7ed453f2','Tee Johnson','teejohnson@gmail.com','1112223344','$2a$10$yHxLm1od2HqFff5.Xq9qt.KCfDhfrBmjVAJkJI6.NQo1ERrhZg/Vu','2023-12-06 09:55:24','2023-12-06 09:55:24'),('3d8805e0-34d4-4f7d-9d0a-05d309938db1','John1 Doe','john2@gmail.com','1112223344','$2a$10$YJnFKyeh7gxCo5WLBTAlsuHPfHl7o9J1GmnedP1NxRL11Gr/49ZrW','2023-12-05 14:38:26','2023-12-05 14:38:26'),('3df6a3ee-982e-43a3-ae84-576ce8b7019e','Tee Johnson','tee@gmail.com','1112223344','$2a$10$7KfC77OHYNmTRjKZUBJOF.BhHxxuMYoluRyH1C8LZ.8zv9h8zjgdS','2023-10-28 17:39:04','2023-10-28 17:39:04'),('4d35bb7b-79e1-4637-b906-6c3073cb7174','another Johnson','anojohn@gmail.com','1112223344','$2a$10$ZdCOUR8eSU.VW0vMGuKTkOFgipvhYsNojvZtWNzYU6oA/q6xoYfkG','2023-12-26 12:24:00','2023-12-26 12:24:00'),('4fe19aed-27d0-4b41-96bf-17ce8fbad44a','John1 Doe','john4@gmail.com','1112223344','$2a$10$V/SIwu/aZ3QxEA/ftlxHA.4azB0PIhcLG3x.I.4Uozg.domEx07DC','2023-12-05 14:42:16','2023-12-05 14:42:16'),('7bb7244f-0b01-4310-8965-f04992c3d28a','John1 Doe','john3@gmail.com','1112223344','$2a$10$EUFUrgmMoXtgHsSXig9NKOiOpXj5L8q18q1kbg70MtqzW/8A8jdGm','2023-12-05 14:40:03','2023-12-05 14:40:03'),('9fb42c6b-df3d-416d-bd75-de2417898a3e','another Johnson2','anojohn2@gmail.com','1112223344','$2a$10$23OsIu2oX1bX5pSLPnekOeE8og0Ifv6y8c8Fkp5N1Us33K3AD8bhm','2023-12-27 10:01:20','2023-12-27 10:01:20'),('bbcdfd28-5ee1-4050-b604-06ebe7003af1','John1 Doe','john1@gmail.com','1112223344','$2a$10$EDdabliysNpWUy0UjMkG1eyMUS24rcwW8QMKX7HOjEwB4.UWseFOe','2023-12-05 14:29:36','2023-12-05 14:29:36'),('c0dcbe60-dd6a-4bf6-821f-20a0f39e331f','John Doe','john@gmail.com','1112223344','$2a$10$xzEAVU844UoAJ7p/ADeAO./ZxVJUTn9EQWmXGNJDRo0oUPfhZWUs.','2023-10-26 17:33:19','2023-10-28 17:36:20'),('c18b0308-1277-46ed-bfb3-ba31b0d54ecd','another Johnson','anojohn1@gmail.com','1112223344','$2a$10$wbOcDFNLfSqNOrzU249Ex.0FW.knWvhZqeS7mDVqEY0kA5cMGNKCW','2023-12-26 12:29:32','2023-12-26 12:29:32');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet`
--

DROP TABLE IF EXISTS `wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `balance` float DEFAULT '0',
  `pin` text,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_wallet_user1_idx` (`user_id`),
  CONSTRAINT `fk_wallet_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet`
--

LOCK TABLES `wallet` WRITE;
/*!40000 ALTER TABLE `wallet` DISABLE KEYS */;
INSERT INTO `wallet` VALUES ('1b7e31b2-2a6f-4b62-83bd-212ab69a6f97','4d35bb7b-79e1-4637-b906-6c3073cb7174',0,NULL,'2023-12-26 12:24:01'),('4ef28a3d-2fe0-489e-bd7f-dc820509d075','26e7af11-c572-4071-836f-808b7ed453f2',1290,NULL,'2023-12-08 18:27:58'),('73ace0d7-c9e5-4ce2-b63b-343478a727c2','c0dcbe60-dd6a-4bf6-821f-20a0f39e331f',705.2,NULL,'2023-12-08 18:30:24'),('821903a5-43eb-4d7f-aeb4-e907f245f3ce','3df6a3ee-982e-43a3-ae84-576ce8b7019e',495,NULL,'2023-10-28 18:05:14'),('9aa0db63-3dc9-4f49-81de-7190f629717c','9fb42c6b-df3d-416d-bd75-de2417898a3e',0,NULL,'2023-12-27 10:01:21'),('a769b21b-4fd4-4db7-9df3-a54f4d021bcc','c18b0308-1277-46ed-bfb3-ba31b0d54ecd',0,NULL,'2023-12-26 12:29:33'),('f2e19414-128b-4f32-89b7-aa19ff00eff1','4fe19aed-27d0-4b41-96bf-17ce8fbad44a',0,NULL,'2023-12-05 14:42:16');
/*!40000 ALTER TABLE `wallet` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-31 19:43:28
