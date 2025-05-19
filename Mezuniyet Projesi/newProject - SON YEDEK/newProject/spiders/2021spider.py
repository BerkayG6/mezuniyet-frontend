import scrapy
import scrapy.spiderloader
from ..items.items import items2021 
from scrapy.loader import ItemLoader
from ..urls import departmentID2021


class Data2021(scrapy.Spider) :
    

    name='2021spider'
    
    def start_requests(self):
        urls=[]
        for i in departmentID2021:
            urls.append('https://yokatlas.yok.gov.tr/2021/content/lisans-dynamic/1000_1.php?y='+str(i))
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
    
    def parse(self,response):

        items=items2021()

        DEPARTMENT_NAME=response.xpath("/html/body/table[1]/thead/tr/th/big/text()").extract_first()
        DEPARTMENT_ID=response.xpath("/html/body/table[1]/tbody/tr[1]/td[2]/text()").extract_first()
        UNIVERSITY_ID = response.xpath("/html/body/table[1]/tbody/tr[1]/td[2]/text()").extract_first()[0:4]
        UNIVERSITY_TYPE=response.xpath("/html/body/table[1]/tbody/tr[2]/td[2]/text()").extract_first()
        UNIVERSITY_NAME=response.xpath("/html/body/table[1]/tbody/tr[3]/td[2]/text()").extract_first()
        FACULTY_NAME=response.xpath("/html/body/table[1]/tbody/tr[4]/td[2]/text()").extract_first()
        SCORE_TYPE=response.xpath("/html/body/table[1]/tbody/tr[5]/td[2]/text()").extract_first()
        SCHOLARSHIP_TYPE=response.xpath("/html/body/table[1]/tbody/tr[6]/td[2]/text()").extract_first()
        GENERAL_CAPACITY=response.xpath("/html/body/table[2]/tbody/tr[1]/td[2]/text()").extract_first()
        SCHOOL_CAPACITY=response.xpath("/html/body/table[2]/tbody/tr[2]/td[2]/text()").extract_first()
        SUM_CAPACITY=response.xpath("/html/body/table[2]/tbody/tr[3]/td[2]/strong/text()").extract_first()
        GENERAL_ENROLLMENT=response.xpath("/html/body/table[2]/tbody/tr[4]/td[2]/text()").extract_first()
        SCHOOL_ENROLLMENT=response.xpath("/html/body/table[2]/tbody/tr[5]/td[2]/text()").extract_first()
        # if SCHOOL_ENROLLMENT=="---":
        #     SCHOOL_ENROLLMENT=0
        SUM_ENROLLMENT=response.xpath("/html/body/table[2]/tbody/tr[6]/td[2]/strong/text()").extract_first()
        FIELD_RATE=response.xpath("/html/body/table[2]/tbody/tr[8]/td[2]/text()").extract_first()
        # if FIELD_RATE:
        #     FIELD_RATE = FIELD_RATE.replace("%", "")  
        #     FIELD_RATE = FIELD_RATE.replace(",", ".")  
        #     try:
        #         FIELD_RATE = float(FIELD_RATE)  
        #     except ValueError:
        #         FIELD_RATE = None  
        # else:
        #     FIELD_RATE = None  
        LAST_SCORE=response.xpath("/html/body/table[3]/tbody/tr[1]/td[2]/text()").extract_first()
        #LAST_SCORE = LAST_SCORE.replace(",", ".")
        LAST_RANK=response.xpath("/html/body/table[3]/tbody/tr[3]/td[2]/text()").extract_first()
        #LAST_RANK = LAST_RANK.replace(".", "")
        FIRST_SCORE=response.xpath("/html/body/table[3]/tbody/tr[5]/td[2]/text()").extract_first()
        #FIRST_SCORE = FIRST_SCORE.replace(",", ".")
        FIRST_RANK=response.xpath("/html/body/table[3]/tbody/tr[6]/td[2]/text()").extract_first()
        #FIRST_RANK = FIRST_RANK.replace(".", "")

        items['DEPARTMENT_NAME']=DEPARTMENT_NAME
        items['DEPARTMENT_ID']=DEPARTMENT_ID
        items['UNIVERSITY_TYPE']=UNIVERSITY_TYPE
        items['UNIVERSITY_NAME']=UNIVERSITY_NAME
        items['UNIVERSITY_ID']=UNIVERSITY_ID
        items['FACULTY_NAME']=FACULTY_NAME
        items['SCORE_TYPE']=SCORE_TYPE
        items['SCHOLARSHIP_TYPE']=SCHOLARSHIP_TYPE
        items['GENERAL_CAPACITY']=GENERAL_CAPACITY
        items['SCHOOL_CAPACITY']=SCHOOL_CAPACITY
        items['GENERAL_ENROLLMENT']=GENERAL_ENROLLMENT
        items['SCHOOL_ENROLLMENT']=SCHOOL_ENROLLMENT
        items['SUM_CAPACITY']=SUM_CAPACITY
        items['SUM_ENROLLMENT']=SUM_ENROLLMENT
        items['FIELD_RATE']=FIELD_RATE
        items['LAST_SCORE']=LAST_SCORE
        items['LAST_RANK']=LAST_RANK
        items['FIRST_SCORE']=FIRST_SCORE
        items['FIRST_RANK']=FIRST_RANK

        yield items