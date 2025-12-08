from django.contrib.auth.models import AbstractUser, User
from django.db import models
from datetime import date, timedelta
from django.utils import timezone

# Create your models here.

def get_expiry_date():
    return date.today() + timedelta(days=365)

class CommonInfo(models.Model):
    GENDER_CHOICE = [
        ('Male', 'Male'),
        ('Female', 'Female')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50, choices=GENDER_CHOICE)

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
    
    Role_choice = [
        ('Librarian', 'Librarian'),
        ('Assistant Librarian', 'Assistant Librarian'),
        ('Library Admin', 'Library Admin')
    ]

    employee_id = models.CharField(max_length=50, default='STF-')
    hire_date = models.DateField(auto_now_add=True)
    role = models.CharField(max_length=50, choices=Role_choice, default='Librarian')
    is_blocked = models.BooleanField(default=False)
    login_time =models.DateTimeField(null=True,blank=True)
    last_activity = models.DateTimeField(null=True,blank=True)
    

    @property
    def status(self):
        # If manually blocked
        if self.is_blocked:
            return "Blocked"

        # If user never logged in
        if not self.last_activity:
            return "Inactive"

        now = timezone.now()
        diff = now - self.last_activity

        # Online = active within last 5 minutes
        if diff < timedelta(minutes=5):
            return "Online"

        # Away = active within last 1 hour
        if diff < timedelta(hours=1):
            return "Away"

        # Offline = last seen within 24 hours
        if diff < timedelta(days=1):
            return "Offline"

        # Inactive = no activity for more than 30 days
        if diff > timedelta(days=30):
            return "Inactive"

        return "Offline"

    
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

class Member(CommonInfo):
    
    member_id = models.CharField(max_length=50, default='MBR-')
    join_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField(default=get_expiry_date)
    login_time =models.TimeField(null=True,blank=True)
    is_blocked = models.BooleanField(default=False)
    last_activity = models.DateTimeField(null=True,blank=True)
    borrow_count = models.IntegerField(null=True,blank=True)
    
    @property
    def status(self):
        # If manually blocked
        if self.is_blocked:  
            return "Blocked"

        # If user never logged in
        if not self.last_activity:
            return "Inactive"

        now = timezone.now()
        diff = now - self.last_activity

        # Online = active within last 5 minutes
        if diff < timedelta(minutes=5):
            return "Online"

        # Away = active within last 1 hour
        if diff < timedelta(hours=1):
            return "Away"

        # Offline = last seen within 24 hours
        if diff < timedelta(days=1):
            return "Offline"

        # Inactive = no activity for more than 30 days
        if diff > timedelta(days=30):
            return "Inactive"

        return "Offline"

    
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

class Book(models.Model):
    STATUS_CHOICE = [
        ('available', 'Available'),
        ('unavailable', 'Unavailable')
    ]
    Genre_CHOICE = [
        ('fiction', 'Fiction'),
        ('nonfiction', 'Non-Fiction'),
        ('biography', 'Biography'),
        ('selfhelp', 'Self-Help'),
        ('children', 'Children'),
        ('youngadult', 'Young Adult'),
        ('mystery', 'Mystery'),
        ('romance', 'Romance'),
        ('thriller', 'Thriller'),
        ('history', 'History')
    ]
    
    Title = models.CharField(max_length=50)
    Author = models.CharField(max_length=50)
    Price = models.IntegerField()
    Published_date = models.DateField(default=date.today)
    Image = models.ImageField(upload_to='images/')
    ISBN = models.CharField(max_length=50, unique=True)
    Pages = models.IntegerField()
    Status = models.CharField(max_length=50, choices=STATUS_CHOICE, default='available')
    Genre = models.CharField(max_length=50, choices=Genre_CHOICE)
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
    is_overdue = models.BooleanField(default=False)
    fine = models.IntegerField(default=0)
    
    def __str__(self):
        return f'{self.borrower} borrowed {self.book} on {self.borrow_date}'
