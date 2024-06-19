from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        if username is None or password is None:
            return   
        try:
            user = UserModel.objects.get(Q(username__exact=username) | Q(email__iexact=username))
        except: return None 
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        return None