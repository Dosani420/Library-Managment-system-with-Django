from django.contrib import admin
from django.contrib.auth.models import User

from .models import Book,BorrowRecord,Staff,Member

# Register your models here.


admin.site.register(Book)
admin.site.register(BorrowRecord)
admin.site.register(Staff)
admin.site.register(Member)
