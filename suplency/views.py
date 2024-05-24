from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Usuario
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.urls import reverse
from django.contrib.auth.decorators import login_required

user = get_user_model()

def HomeView(request):
    return render(request, 'suplency/home.html')

def estudoView(request):
    return render(request, 'suplency/estudo.html')

def loginView(request):
    if request.method == 'POST':
        nome_email = request.POST.get('nome_email')
        senha = request.POST.get('senha')
        print(nome_email, senha)
        usuario = authenticate(request, username=nome_email, password=senha)
        if usuario is not None:
            login(request, usuario)
            return redirect(reverse('estudo'))
        else:
            return redirect(reverse('singin'))
    return render(request, 'suplency/login.html')

def singinView(request):
    print(request.user.is_authenticated)
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        if user.objects.filter(username=nome).exists():
            return JsonResponse({'mensagem': 'Esse nome de usuário já está em uso.'})
        elif user.objects.filter(email=email).exists():
            return JsonResponse({'mensagem': 'Esse email já está em uso.'})
        else:
            usuario = Usuario.objects.create_user(nome, email, senha)
            login(request, usuario)
        return redirect(reverse('estudo'))
    return render(request, 'suplency/singin.html')

def logoutView(request):
    logout(request)
    return render(request, 'suplency/logout.html')

def carregarPagina(request, materia, pagina):
    if materia == 'matematica' and pagina == 2:
        return JsonResponse({'conteudo': 'teste teste'})