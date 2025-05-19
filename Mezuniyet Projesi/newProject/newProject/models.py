from sqlalchemy import create_engine, Column, Integer, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from scrapy.utils.project import get_project_settings


DeclarativeBase = declarative_base()

def db_connect():
    return create_engine(get_project_settings().get("CONNECTION_STRING"))

def create_table(engine):
    DeclarativeBase.metadata.create_all(engine)

class Seng491DB(DeclarativeBase): 
    __tablename__ = 'Information_2019' 

   
    DEPARTMENT_ID = Column('DEPARTMENT_ID', Integer, primary_key=True)
    DEPARTMENT_NAME = Column('DEPARTMENT_NAME', Text)
    UNIVERSITY_TYPE = Column('UNIVERSITY_TYPE', Text)
    UNIVERSITY_NAME = Column('UNIVERSITY_NAME', Text)
    UNIVERSITY_ID = Column('UNIVERSITY_ID', Integer, primary_key=True)
    FACULTY_NAME = Column('FACULTY_NAME', Text)
    SCORE_TYPE = Column('SCORE_TYPE', Text)
    SCHOLARSHIP_TYPE = Column('SCHOLARSHIP_TYPE', Text)
    GENERAL_CAPACITY = Column('GENERAL_CAPACITY', Text)#integer
    SCHOOL_CAPACITY = Column('SCHOOL_CAPACITY', Text)#integer
    GENERAL_ENROLLMENT = Column('GENERAL_ENROLLMENT', Text)#integer
    SCHOOL_ENROLLMENT = Column('SCHOOL_ENROLLMENT', Text)#integer
    SUM_CAPACITY = Column('SUM_CAPACITY', Text)#integer
    SUM_ENROLLMENT = Column('SUM_ENROLLMENT', Text)#integer
    FIELD_RATE = Column('FIELD_RATE', Text)#integer
    LAST_SCORE = Column('LAST_SCORE', Text)#integer
    LAST_RANK = Column('LAST_RANK', Text)#integer
    FIRST_SCORE = Column('FIRST_SCORE', Text)#integer
    FIRST_RANK = Column('FIRST_RANK', Text) #integer
