from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, get_user_model
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from .forms import CreateAccount, LoginAccount


UserModel = get_user_model()

def HomeView(request):
    return render(request, 'suplency/home.html')

def estudoView(request):
    return render(request, 'suplency/estudo.html')

def loginView(request):
    if request.user.is_authenticated:
        return redirect(reverse('estudo'))
    elif request.method == 'POST':
        form = LoginAccount(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect(reverse('estudo'))
    else:
        form = LoginAccount()
    context = {
        'form': form,
        'link': reverse('singin'),
        'link_text': 'Ainda não tem uma conta? Crie aqui!',
    }
    return render(request, 'suplency/enter.html', context)

def singinView(request):
    if request.user.is_authenticated:
        return redirect(reverse('estudo'))
    elif request.method == 'POST':
        form = CreateAccount(request.POST)
        if form.is_valid():
            form.save_and_login(request)
            return redirect(reverse('estudo'))
    else:
        form = CreateAccount()
    context = {
        'form': form,
        'link': reverse('login'),
        'link_text': 'Já tem uma conta? Faça login aqui!',
    }

    return render(request, 'suplency/enter.html', context)

def logoutView(request):
    logout(request)
    return render(request, 'suplency/logout.html')

def sendEmail(request):
    send_mail('Assunt', 'Esse é o email que estou te enviando', 'mateusfortes101@gmail.com', ['mateusfortes10@gmail.com'])
    return HttpResponse('email enviado')

def carregarPagina(request, materia, pagina):
    if materia == 'matematica' and pagina == 2:
        return JsonResponse({'conteudo': 'teste teste'})