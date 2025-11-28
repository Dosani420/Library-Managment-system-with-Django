"""
URL configuration for Sample project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index' ),
    path('login/',views._login,name='login'),
    path('logout/',views.logout_user,name='logout'),
    path('signup/',views.signup,name='signup'),
    path('register/',views.add_user,name='register'),
    path('home/',views.user,name='user'),
    path('add_book/',views.add_book,name='add_book'),
    path('edit_book/<int:book_id>',views.edit_book,name='edit_book'),
    path('delete_book/<int:book_id>',views.delete_book,name='delete_book'),
    path('available_books/',views.available_books,name='available_books'),
    path('borrow_book/<int:book_id>',views.borrow_book,name='borrow_book'),
    path('return_book/<int:book_id>',views.return_book,name='return_book'),
    path('my_books/',views.my_books,name='my_books'),
    path('staff_dashboard/',views.staff_dashboard,name='staff_dashboard'),
]
