from sqlalchemy.orm import sessionmaker 
from newProject.onmodels import Seng491DB, db_connect, create_table

class OnNewProjectPipeline(object):
    def __init__(self):
        engine = db_connect()
        create_table(engine)
        self.Session = sessionmaker(bind=engine)

    def process_item(self, item, spider):
        session = self.Session()
        seng491= Seng491DB()

        seng491.DEPARTMENT_NAME = item["DEPARTMENT_NAME"]
        seng491.DEPARTMENT_ID = item["DEPARTMENT_ID"]
        seng491.UNIVERSITY_TYPE = item["UNIVERSITY_TYPE"]
        seng491.UNIVERSITY_NAME = item["UNIVERSITY_NAME"]
        seng491.UNIVERSITY_ID = item["UNIVERSITY_ID"]
        seng491.FACULTY_NAME = item["FACULTY_NAME"]
        seng491.SCORE_TYPE = item["SCORE_TYPE"]
        seng491.SCHOLARSHIP_TYPE = item["SCHOLARSHIP_TYPE"]
        seng491.GENERAL_CAPACITY = item["GENERAL_CAPACITY"]
        seng491.SCHOOL_CAPACITY = item["SCHOOL_CAPACITY"]
        seng491.GENERAL_ENROLLMENT = item["GENERAL_ENROLLMENT"]
        seng491.SCHOOL_ENROLLMENT = item["SCHOOL_ENROLLMENT"]
        seng491.SUM_CAPACITY = item["SUM_CAPACITY"]
        seng491.SUM_ENROLLMENT = item["SUM_ENROLLMENT"]
        seng491.FIELD_RATE = item["FIELD_RATE"]
        seng491.LAST_SCORE_12 = item["LAST_SCORE_12"]
        seng491.LAST_RANK_12 = item["LAST_RANK_12"]
        seng491.LAST_SCORE_18 = item["LAST_SCORE_18"]
        seng491.LAST_RANK_18 = item["LAST_RANK_18"]

        

        try:
            session.add(seng491)
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()

        return item