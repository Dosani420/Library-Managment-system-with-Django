from django.contrib.auth.models import AbstractUser, User
from django.db import models
from datetime import date, timedelta

# Create your models here.

class CommonInfo(models.Model):
    GENDER_CHOICE = [('Male','Male'),
    ('Female','Female')]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50,choices=GENDER_CHOICE)
    

    def get_age(self):
        today = date.today()
        age = today.year - self.date_of_birth.year
        
        if today.month < self.date_of_birth.month or \
           (today.month == self.date_of_birth.month and today.day < self.date_of_birth.day):
            age -= 1
        return age

    class Meta:
        abstract = True

class Staff(CommonInfo):
    Role_choice = [('Librarian','Librarian'),
    ('Assistant Librarian','Assistant Librarian'),
    ('Library Admin','Library Admin')
    ]

    employee_id = models.CharField(max_length=50,unique=True,default='STF-')
    hire_date = models.DateField(auto_now_add=True)
    role = models.CharField(max_length=50,choices=Role_choice,default='Librarian')
    
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

class Member(CommonInfo):
    member_id = models.CharField(max_length=50,unique=True,default='MBR-')
    join_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField(default=date.today() + timedelta(days=365))  
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'




class Book(models.Model):
    STATUS_CHOICE = [
        ('available','Available'),
        ('unavailable','Unavailable')
    ]
    Genre_CHOICE = [
        ('fiction','Fiction'),
        ('nonfiction','Non-Fiction'),
        ('biography','Biography'),
        ('selfhelp','Self-Help'),
        ('children','Children'),
        ('youngadult','Young Adult'),
        ('mystery','Mystery'),
        ('romance','Romance'),
        ('thriller','Thriller'),
        ('history','History')
    ]
    
    Title = models.CharField(max_length=50)
    Author = models.CharField(max_length=50)
    Price = models.IntegerField()
    Published_date = models.DateField(default=date.today())
    Image = models.ImageField(upload_to='images/')
    ISBN = models.CharField(max_length=50,unique=True)
    Pages = models.IntegerField()
    Status = models.CharField(max_length=50,choices=STATUS_CHOICE,default='available')
    Genre = models.CharField(max_length=50,choices=Genre_CHOICE)
    Added_on = models.DateTimeField(auto_now_add=True)
    Updated_on = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.Title

class BorrowRecord(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrower = models.ForeignKey(Member, on_delete=models.CASCADE)
    borrow_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    due_date = models.DateField()
    is_returned = models.BooleanField(default=False)
    fine = models.IntegerField(default=0)
    
    def __str__(self):
        return f'{self.borrower} borrowed {self.book} on {self.borrow_date}'

