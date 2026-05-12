-- 智鉴百草数据库设计

-- 创建数据库
CREATE DATABASE IF NOT EXISTS zhijianbaicao DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE zhijianbaicao;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 草药表
CREATE TABLE IF NOT EXISTS herbs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    function TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 方剂表
CREATE TABLE IF NOT EXISTS formulas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    function TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 疾病表
CREATE TABLE IF NOT EXISTS diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 疾病-方剂关系表
CREATE TABLE IF NOT EXISTS disease_formulas (
    disease_id INT,
    formula_id INT,
    PRIMARY KEY (disease_id, formula_id),
    FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE,
    FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 草药-方剂关系表
CREATE TABLE IF NOT EXISTS herb_formulas (
    herb_id INT,
    formula_id INT,
    PRIMARY KEY (herb_id, formula_id),
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE,
    FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 方剂-草药组成表（包含用量）
CREATE TABLE IF NOT EXISTS formula_herbs (
    formula_id INT,
    herb_id INT,
    amount VARCHAR(50), -- 用量，如 "10g"
    PRIMARY KEY (formula_id, herb_id),
    FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE CASCADE,
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 预诊报告表
CREATE TABLE IF NOT EXISTS pre_diagnosis_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    patient_name VARCHAR(50),
    gender VARCHAR(10),
    age VARCHAR(10),
    occupation VARCHAR(50),
    main_complaint TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    content TEXT, -- 完整报告内容
    conversation_history JSON, -- 对话历史
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 草药类别表
CREATE TABLE IF NOT EXISTS herb_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level INT NOT NULL, -- 类别级别，如5、10、300
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 草药-类别关系表
CREATE TABLE IF NOT EXISTS herb_category_relationships (
    herb_id INT,
    category_id INT,
    PRIMARY KEY (herb_id, category_id),
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES herb_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
