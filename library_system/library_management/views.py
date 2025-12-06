from django.shortcuts import render,redirect,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login,logout,authenticate
from django.contrib import messages
from .models import Staff,Member,Book,BorrowRecord
from datetime import date, datetime, timedelta

# Create your views here.

def index(request):
    return render(request, 'index.html')

def _login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['loginpwd']
        user = authenticate(request,username=username,password=password)
        if user is not None:
            login(request,user)
            request.session['user_id'] = user.id
            request.session['is_logged_in'] = True
            
            if Staff.objects.filter(user=user).exists():
                return redirect('/staff_dashboard/')
            else:
                return redirect('/home/')
        else:
            return render(request, 'login.html',{'mes':'Wrong password'})
    elif request.session.get('is_logged_in'):
        return redirect('/home/')
    else:
        return render(request,'login.html')

def logout_user(request):
    logout(request)
    request.session.flush()
    return redirect('/login/')

def signup(request):
    if request.session.get('is_logged_in'):
        return redirect('/home/')
    else:
        return render(request, 'signup.html')

def add_user(request):
    if request.method == 'POST':
        role = request.POST['role']
        firstname = request.POST['fname']
        lastname = request.POST['lname']
        email = request.POST['email']
        username = request.POST['username']
        password = request.POST['password']
        gender = request.POST['gender']
        dob_str = request.POST['dob']
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
        
        user = User.objects.create_user(username,email,password)
        user.first_name = firstname
        user.last_name = lastname
        user.save()

        if role == 'staff':
            otp = request.POST['initial_id']
            if otp == '1314':
                staff = Staff.objects.create(user=user,gender=gender,
                                        date_of_birth=dob)

                staff.save()
            else:
                return render(request, 'signup.html',{'mes':'Wrong OTP'})

        else:
            
            member = Member.objects.create(user=user,gender=gender,
                                    date_of_birth=dob)

            member.save()

        return redirect('/login/')

def user(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        
        if Staff.objects.filter(user=user).exists():
            return redirect('/staff_dashboard/')
        
        context = {
            'user': user,
            'borrowed_books_count': 0,
            'returned_books_count': 0,
            'total_fines': 0,
            'recent_books': []
        }
        
        try:
            member = Member.objects.get(user=user)
            
            borrowed_records = BorrowRecord.objects.filter(borrower=member)
            
            context['borrowed_books_count'] = borrowed_records.filter(return_date__isnull=True).count()
            
            context['returned_books_count'] = borrowed_records.filter(return_date__isnull=False).count()
            
            total_fines = 0
            for record in borrowed_records:
                total_fines += record.fine
            context['total_fines'] = total_fines
            
            context['recent_books'] = Book.objects.order_by('-Added_on')[:4]
            
        except Member.DoesNotExist:
            pass
            
        return render(request, 'homepage.html', context)
    else:
        return redirect('/login/')

def password_reset(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        if request.method == 'POST':
            current = request.POST['current_pass']
            new = request.POST['new_pass']
            confirm = request.POST['confirm_pass']
            if user.check_password(current):
                if new == confirm:
                    user.set_password(new)
                    user.save()
                    messages.success(request, 'Password changed successfully.')
                    return redirect('/home/')
                else:
                    messages.error(request, 'New password and confirm password does not match.')
                    return render(request, 'password_reset.html')
            else:
                messages.error(request, 'Current password is incorrect.')
                return render(request, 'password_reset.html')
        else:
            return render(request, 'password_reset.html')
    else:
        return redirect('/login/')



def staff_dashboard(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        if not Staff.objects.filter(user=user).exists():
            messages.error(request, 'Access denied. Staff only area.')
            return redirect('/home/')
            
        total_books = Book.objects.count()
        total_members = Member.objects.count()
        active_loans = BorrowRecord.objects.filter(return_date__isnull=True).count()
        
        today = date.today()
        overdue_books = BorrowRecord.objects.filter(return_date__isnull=True, due_date__lt=today).count()
        
        context = {
            'total_books': total_books,
            'total_members': total_members,
            'active_loans': active_loans,
            'overdue_books': overdue_books
        }
        return render(request, 'staff_dashboard.html', context)
    else:
        return redirect('/login/')

def manage_books(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        if not Staff.objects.filter(user=user).exists():
            return redirect('/home/')
            
        books = Book.objects.all().order_by('-Added_on')
        return render(request, 'manage_books.html', {'books': books})
    else:
        return redirect('/login/')

def add_book(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        if not Staff.objects.filter(user=user).exists():
            return redirect('/home/')
            
        if request.method == 'POST':
            try:
                title = request.POST['title']
                author = request.POST['author']
                isbn = request.POST['isbn']
                published_date_str = request.POST['published_date']
                published_date = datetime.strptime(published_date_str, '%Y-%m-%d').date()
                genre = request.POST['genre']
                price = request.POST['price']
                pages = request.POST['pages']
                image = request.FILES.get('image')
                
                book = Book.objects.create(Title=title, Author=author, ISBN=isbn,
                                        Published_date=published_date, Genre=genre,
                                        Price=price, Pages=pages, Image=image)
                book.save()
                messages.success(request, f'Book "{title}" added successfully.')
                return redirect('/staff_dashboard/')
            except Exception as e:
                messages.error(request, f'Error adding book: {str(e)}')
                return render(request, 'add_book.html')
        else:
            return render(request, 'add_book.html')
    else:
        return redirect('/login/')

def edit_book(request, book_id):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        if not Staff.objects.filter(user=user).exists():
            return redirect('/home/')
            
        try:
            book = Book.objects.get(id=book_id)
            if request.method == 'POST':
                book.Title = request.POST['title']
                book.Author = request.POST['author']
                book.ISBN = request.POST['isbn']
                published_date_str = request.POST['published_date']
                book.Published_date = datetime.strptime(published_date_str, '%Y-%m-%d').date()
                book.Genre = request.POST['genre']
                book.Price = request.POST['price']
                book.Pages = request.POST['pages']
                
                if 'image' in request.FILES:
                    book.Image = request.FILES['image']
                
                book.save()
                messages.success(request, f'Book "{book.Title}" updated successfully.')
                return redirect('/staff_dashboard/')
            else:
                return render(request, 'edit_book.html', {'book': book})
        except Book.DoesNotExist:
            messages.error(request, 'Book not found.')
            return redirect('/staff_dashboard/')
    else:
        return redirect('/login/')

def delete_book(request, book_id):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        if not Staff.objects.filter(user=user).exists():
            return redirect('/home/')
            
        try:
            book = Book.objects.get(id=book_id)
            title = book.Title
            book.delete()
            messages.success(request, f'Book "{title}" deleted successfully.')
        except Book.DoesNotExist:
            messages.error(request, 'Book not found.')
            
        return redirect('/staff_dashboard/')
    else:
        return redirect('/login/')

def available_books(request):
    if request.session.get('is_logged_in'):
        books = Book.objects.filter(Status='available')
        return render(request, 'available_books.html', {'books': books})
    else:
        return redirect('/login/')


def borrow_book(request, book_id):
    if request.session.get('is_logged_in'):
        try:
            book = Book.objects.get(id=book_id)
            
            if book.Status != 'available':
                messages.error(request, 'This book is currently unavailable.')
                return redirect('/available_books/')
            
            user = User.objects.get(id=request.session['user_id'])
            try:
                member = Member.objects.get(user=user)
            except Member.DoesNotExist:
                messages.error(request, 'Member profile not found. Please contact administrator.')
                return redirect('/available_books/')
            
            borrow_date = date.today()
            due_date = borrow_date + timedelta(days=14)  
            
            borrow_record = BorrowRecord.objects.create(
                book=book, 
                borrower=member,
                borrow_date=borrow_date, 
                due_date=due_date
            )
            borrow_record.save()
            
            book.Status = 'unavailable'
            book.save()
            
            messages.success(request, f'Successfully borrowed "{book.Title}". Due date: {due_date.strftime("%B %d, %Y")}')
            return redirect('/available_books/')
            
        except Book.DoesNotExist:
            messages.error(request, 'Book not found.')
            return redirect('/available_books/')
    else:
        return redirect('/login/')


def my_books(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        try:
            member = Member.objects.get(user=user)
            
            all_records = BorrowRecord.objects.filter(borrower=member).order_by('-borrow_date')
            
            active_loans = []
            history = []
            
            today = date.today()
            
            for record in all_records:
                if record.return_date is None:
                    if today > record.due_date:
                        if record.is_returned == False:
                            overdue_days = (today - record.due_date).days
                            record.fine = overdue_days * 10
                            record.is_overdue = True
                        else:
                            record.fine = 0
                            record.is_overdue = False
                    active_loans.append(record)
                else:
                    history.append(record)
            
            context = {
                'active_loans': active_loans,
                'history': history
            }

            return render(request, 'borrowed_books.html', context)
            
        except Member.DoesNotExist:
            messages.error(request, 'Member profile not found.')
            return redirect('/home/')
    else:
        return redirect('/login/')

def member_history(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        history = []
        try:
            member = Member.objects.get(user=user)
            
            all_records = BorrowRecord.objects.filter(borrower=member).order_by('borrow_date')
            
            for record in all_records:
                history.append(record)
            
            context = {
                'history': history
            }
            
            return render(request, 'member_history.html', context)
            
        except Member.DoesNotExist:
            messages.error(request, 'Member profile not found.')
            return redirect('/home/')
    else:
        return redirect('/login/')

def member_fine(request):
    if request.session.get('is_logged_in'):
        user = User.objects.get(id=request.session['user_id'])
        fines = []
        total_fines = 0
        
        try:
            member= Member.objects.get(user=user)

            all_records = BorrowRecord.objects.filter(borrower=member).order_by('borrow_date')
            for record in all_records:
                if record.fine > 0:
                    total_fines += record.fine
                    fines.append(record)
                
            context = {
                'fines':fines,
                'total_fines': total_fines,
                'total_books':len(fines)
            }

            return render(request, 'members_fines.html',context)

        except Member.DoesNotExit:
            messages.error(request, 'Member profile not found')
            return redirect('/home/')
    else:
        return redirect('/login/')

def return_book(request, book_id):
    if request.session.get('is_logged_in'):
        try:
            book = Book.objects.get(id=book_id)
            user = User.objects.get(id=request.session['user_id'])
            member = Member.objects.get(user=user)
            
            borrow_record = BorrowRecord.objects.get(book=book, borrower=member,is_returned=False)
            
            today = date.today()
            if today > borrow_record.due_date:
                overdue_days = (today - borrow_record.due_date).days
                fine_amount = overdue_days * 10
                borrow_record.fine = fine_amount
            
            borrow_record.return_date = today
            borrow_record.is_returned = True
            borrow_record.save()
            
            book.Status = 'available'
            book.save()
            
            messages.success(request, f'Successfully returned "{book.Title}".')
            if borrow_record.fine > 0:
                messages.warning(request, f'Book returned with a fine of PKR {borrow_record.fine}.')
                
        except (Book.DoesNotExist, Member.DoesNotExist, BorrowRecord.DoesNotExist):
            messages.error(request, 'Error returning book. Record not found.')
            
        return redirect('/my_books/')
    else:
        return redirect('/login/')

def manage_members(request):
    members = Member.objects.all()
    active = Member.objects.filter(status='Active').count()
    inactive = Member.objects.filter(status='Inactive').count()
    blocked = Member.objects.filter(status='Blocked').count()
    books_borrowed = BorrowRecord.objects.filter(is_returned = False)
    content = {'members':members,
               'active': active,
               'inactive':inactive,
               'blocked':blocked,
               'books':books_borrowed}
    return render(request,'manage_members.html',content)