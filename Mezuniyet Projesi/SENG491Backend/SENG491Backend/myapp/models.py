from django.db import models

# Create your models here.
from django.db import models

# Şehirler Tablosu
class City(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar
    name = models.CharField(max_length=255)  # Şehir adı

    def __str__(self):
        return self.name

# İlçeler Tablosu
class District(models.Model):
    id = models.AutoField(primary_key=True)  # İlçe için birincil anahtar
    city = models.ForeignKey(City, on_delete=models.CASCADE)  # Şehir ile ilişki
    name = models.CharField(max_length=255)  # İlçe adı

    def __str__(self):
        return self.name

# Üniversiteler Tablosu
class University(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar
    name = models.CharField(max_length=255)  # Üniversite adı
    type = models.CharField(max_length=255)  # Üniversite türü (örn. devlet, özel)

    def __str__(self):
        return self.name

# Fakülteler Tablosu
class Faculty(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar
    university = models.ForeignKey(University, on_delete=models.CASCADE)  # Üniversite ile ilişki
    name = models.CharField(max_length=255)  # Fakülte adı

    def __str__(self):
        return f"{self.name} - {self.university.name}"

# Bölümler Tablosu
class Department(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)  # Fakülte ile ilişki
    name = models.CharField(max_length=255)  # Bölüm adı
    education_language = models.CharField(max_length=255)  # Eğitim dili
    city = models.ForeignKey(City, on_delete=models.CASCADE)  # Şehir ile ilişki
    district = models.ForeignKey(District, on_delete=models.CASCADE)  # İlçe ile ilişki

    def __str__(self):
        return f"{self.name} - {self.faculty.name} ({self.faculty.university.name})"

from django.db import models

# Year Tablosu
class Year(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar

    def __str__(self):
        return str(self.id)  # Yıl id'si genelde yıl olarak ifade edilir (örn. 2023)

# Puan Türü Tablosu
class ScoreType(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar
    name = models.CharField(max_length=255)  # Puan türü adı

    def __str__(self):
        return self.name

# Burs Türü Tablosu
class ScholarshipType(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar
    name = models.CharField(max_length=255)  # Burs türü adı

    def __str__(self):
        return self.name

# Kontenjan Türü Tablosu
class QuotaType(models.Model):
    id = models.AutoField(primary_key=True)  # Otomatik birincil anahtar
    name = models.CharField(max_length=255)  # Kontenjan türü adı

    def __str__(self):
        return self.name

# Yerleşim Analizi Tablosu
class PlacementAnalysis(models.Model):
    university = models.ForeignKey('University', on_delete=models.CASCADE)  # Üniversite ile ilişki
    faculty = models.ForeignKey('Faculty', on_delete=models.CASCADE)  # Fakülte ile ilişki
    department = models.ForeignKey('Department', on_delete=models.CASCADE)  # Bölüm ile ilişki
    year = models.ForeignKey(Year, on_delete=models.CASCADE)  # Yıl ile ilişki
    score_type = models.ForeignKey(ScoreType, on_delete=models.CASCADE)  # Puan türü ile ilişki
    scholarship_type = models.ForeignKey(ScholarshipType, on_delete=models.CASCADE)  # Burs türü ile ilişki
    quota_type = models.ForeignKey(QuotaType, on_delete=models.CASCADE)  # Kontenjan türü ile ilişki

    def __str__(self):
        return f"{self.university.name} - {self.faculty.name} - {self.department.name}"
