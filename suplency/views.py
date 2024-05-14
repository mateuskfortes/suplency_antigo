from django.shortcuts import render

def Home(request):
    return render(request, 'suplency/home.html')

def estudo(request):
    return render(request, 'suplency/estudo.html')

def login(request):
    return render(request, 'suplency/login.html')

def singin(request):
    return render(request, 'suplency/singin.html')