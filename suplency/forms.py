from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UsernameField
from django.contrib.auth import authenticate, login
from django.db import IntegrityError
from django import forms
from suplency.models import Usuario

class CreateAccount(UserCreationForm):
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={
                    'class': 'input',
                    'placeholder': 'Nome de usuário',
                }),
            'email': forms.EmailInput(attrs={
                    'class': 'input',
                    'placeholder': 'Email',
                }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        password1 = self.fields['password1']
        password2 = self.fields['password2']
        
        password1.widget.attrs.update({
                'class': 'input',
                'placeholder': 'senha'
            })
        password1.label = 'Digite a Senha'
        password2.widget.attrs.update({
                'class': 'input',
                'placeholder': 'Repita a senha'
            })
        password2.label = 'Confirme a senha'
        
    def save_and_login(self, request, commit=True):
        try:
            user = self.save(commit)
        except IntegrityError:
            username = request.POST['username']
            password = request.POST['password1']
            user = authenticate(request, username=username, password=password)
        login(request, user)
        return user
        

class LoginAccount(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        username = self.fields['username']
        password = self.fields['password']
        username.widget.attrs.update({
                'class': 'input',
                'placeholder': 'Login'
            })
        username.label = 'Usuário ou email'
        password.widget.attrs.update({
                'class': 'input',
                'placeholder': 'Senha'
            })
        password.label = 'Senha'