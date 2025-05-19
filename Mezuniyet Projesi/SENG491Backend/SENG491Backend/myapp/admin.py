from django.contrib import admin
from .models import City, District, University, Faculty, Department, Year, ScoreType, ScholarshipType, QuotaType, PlacementAnalysis

admin.site.register(City)
admin.site.register(District)
admin.site.register(University)
admin.site.register(Faculty)
admin.site.register(Department)
admin.site.register(Year)
admin.site.register(ScoreType)
admin.site.register(ScholarshipType)
admin.site.register(QuotaType)
admin.site.register(PlacementAnalysis)
