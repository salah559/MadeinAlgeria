-- Factory Directory Database Schema for MySQL
-- Run this SQL in phpMyAdmin to create the required tables

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    googleId VARCHAR(255),
    picture TEXT,
    role VARCHAR(50) DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS factories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nameAr VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    descriptionAr TEXT NOT NULL,
    wilaya VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    products JSON,
    productsAr JSON,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    addressAr TEXT NOT NULL,
    logoUrl TEXT,
    imageUrl TEXT,
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    gallery JSON,
    website VARCHAR(500),
    facebook VARCHAR(500),
    instagram VARCHAR(500),
    linkedin VARCHAR(500),
    twitter VARCHAR(500),
    whatsapp VARCHAR(50),
    certified BOOLEAN DEFAULT FALSE,
    certifications JSON,
    size VARCHAR(50),
    foundedYear INT,
    ownerId VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    viewsCount INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviewsCount INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wilaya (wilaya),
    INDEX idx_category (category),
    INDEX idx_createdAt (createdAt),
    FULLTEXT idx_search (name, nameAr, description, descriptionAr)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    factoryId VARCHAR(50) NOT NULL,
    userId VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    commentAr TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (factoryId) REFERENCES factories(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_factory (factoryId),
    INDEX idx_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    titleAr VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    messageAr TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    `read` BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (userId),
    INDEX idx_read (`read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    titleAr VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    contentAr LONGTEXT NOT NULL,
    excerpt TEXT NOT NULL,
    excerptAr TEXT NOT NULL,
    coverImage TEXT,
    authorId VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSON,
    published BOOLEAN DEFAULT FALSE,
    viewsCount INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_published (published),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
