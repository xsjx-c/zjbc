from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import json

# 创建数据库引擎，使用SQLite数据库
engine = create_engine('sqlite:///zhijianbaicao.db', echo=True)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类
Base = declarative_base()

# 疾病-方剂关系表
class DiseaseFormula(Base):
    __tablename__ = 'disease_formulas'
    disease_id = Column(Integer, ForeignKey('diseases.id'), primary_key=True)
    formula_id = Column(Integer, ForeignKey('formulas.id'), primary_key=True)

# 草药-方剂关系表
class HerbFormula(Base):
    __tablename__ = 'herb_formulas'
    herb_id = Column(Integer, ForeignKey('herbs.id'), primary_key=True)
    formula_id = Column(Integer, ForeignKey('formulas.id'), primary_key=True)

# 方剂-草药组成表
class FormulaHerb(Base):
    __tablename__ = 'formula_herbs'
    formula_id = Column(Integer, ForeignKey('formulas.id'), primary_key=True)
    herb_id = Column(Integer, ForeignKey('herbs.id'), primary_key=True)
    amount = Column(String(50))  # 用量，如 "10g"

# 草药-类别关系表
class HerbCategoryRelationship(Base):
    __tablename__ = 'herb_category_relationships'
    herb_id = Column(Integer, ForeignKey('herbs.id'), primary_key=True)
    category_id = Column(Integer, ForeignKey('herb_categories.id'), primary_key=True)

# 用户表
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # 关系
    reports = relationship("PreDiagnosisReport", back_populates="user")

# 草药表
class Herb(Base):
    __tablename__ = 'herbs'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # 添加用户关联
    name = Column(String(100), index=True, nullable=False)
    function = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # 关系
    user = relationship("User", backref="herbs")
    formulas = relationship("Formula", secondary="herb_formulas", back_populates="herbs")
    categories = relationship("HerbCategory", secondary="herb_category_relationships", back_populates="herbs")

# 方剂表
class Formula(Base):
    __tablename__ = 'formulas'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # 添加用户关联
    name = Column(String(100), index=True, nullable=False)
    function = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # 关系
    user = relationship("User", backref="formulas")
    herbs = relationship("Herb", secondary="herb_formulas", back_populates="formulas")
    diseases = relationship("Disease", secondary="disease_formulas", back_populates="formulas")
    composition = relationship("FormulaHerb", backref="formula")

# 疾病表
class Disease(Base):
    __tablename__ = 'diseases'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # 添加用户关联
    name = Column(String(100), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # 关系
    user = relationship("User", backref="diseases")
    formulas = relationship("Formula", secondary="disease_formulas", back_populates="diseases")

# 预诊报告表
class PreDiagnosisReport(Base):
    __tablename__ = 'pre_diagnosis_reports'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    patient_name = Column(String(50))
    gender = Column(String(10))
    age = Column(String(10))
    occupation = Column(String(50))
    main_complaint = Column(Text)
    diagnosis = Column(Text)
    treatment_plan = Column(Text)
    content = Column(Text)  # 完整报告内容
    conversation_history = Column(Text)  # 对话历史，存储为JSON字符串
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # 关系
    user = relationship("User", back_populates="reports")
    
    # 辅助方法，用于获取JSON格式的对话历史
    def get_conversation_history(self):
        if self.conversation_history:
            return json.loads(self.conversation_history)
        return []
    
    # 辅助方法，用于设置对话历史为JSON格式
    def set_conversation_history(self, history):
        self.conversation_history = json.dumps(history, ensure_ascii=False)

# 草药类别表
class HerbCategory(Base):
    __tablename__ = 'herb_categories'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # 添加用户关联
    name = Column(String(50), nullable=False)
    level = Column(Integer, nullable=False)  # 类别级别，如5、10、300
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # 关系
    user = relationship("User", backref="herb_categories")
    herbs = relationship("Herb", secondary="herb_category_relationships", back_populates="categories")

# 创建所有表
def create_tables():
    Base.metadata.create_all(bind=engine)

# 获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
