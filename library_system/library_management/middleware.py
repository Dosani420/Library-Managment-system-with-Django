from django.utils import timezone
from .models import Member,Staff

class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            try:
                if Staff.objects.filter(user=request.user):
                    user=Staff.objects.get(user=request.user)
                else:
                    user=Member.objects.get(user=request.user)
                
                user.last_activity = timezone.now()
                user.save(update_fields=['last_activity'])
            except:
                pass

        response = self.get_response(request)
        return response
