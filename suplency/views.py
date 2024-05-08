from django.shortcuts import render

def Home(request):
    return render(request, 'suplency/home.html')

def sing(request):
    return render(request, 'socialaccount/signup.html')