import scrapy
import scrapy.spiderloader
from ..items.items import onitems2022 
from scrapy.loader import ItemLoader
from ..urls import onDepartmentID2022


class onData2022(scrapy.Spider) :
    

    name='on2022spider'
    
    def start_requests(self):
        urls=[]
        for i in onDepartmentID2022:
            urls.append('https://yokatlas.yok.gov.tr/2022/content/onlisans-dynamic/3000_1.php?y='+str(i))
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
    
    def parse(self,response):

        items=onitems2022()

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
        SUM_ENROLLMENT=response.xpath("/html/body/table[2]/tbody/tr[6]/td[2]/strong/text()").extract_first()
        FIELD_RATE=response.xpath("/html/body/table[3]/tbody[2]/tr[1]/td[2]/text()").extract_first()
        LAST_SCORE_12=response.xpath("/html/body/table[4]/tbody/tr[1]/td[2]/text()").extract_first()
        LAST_RANK_12=response.xpath("/html/body/table[4]/tbody/tr[3]/td[2]/text()").extract_first()
        LAST_SCORE_18=response.xpath("/html/body/table[4]/tbody/tr[2]/td[2]/text()").extract_first()
        LAST_RANK_18=response.xpath("/html/body/table[4]/tbody/tr[4]/td[2]/text()").extract_first()
      

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
        items['LAST_SCORE_12']=LAST_SCORE_12
        items['LAST_RANK_12']=LAST_RANK_12
        items['LAST_SCORE_18']=LAST_SCORE_18
        items['LAST_RANK_18']=LAST_RANK_18

        yield items