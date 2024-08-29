from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, get_user_model
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .forms import CreateAccount, LoginAccount
from .models import Caderno, Materia, Pagina, FlashCard
from django.db.models import Q, F
from django.db import models
import json

UserModel = get_user_model()
from setup.settings import BASE_DIR
print(BASE_DIR)
def HomeView(request):
    return render(request, 'suplency/home.html')

def estudoView(request):
    return render(request, 'suplency/estudo.html')

login_required('login')
def flashCardView(request):
    return render(request, 'suplency/flashcard.html')

def loadFlashCard(request):
    if request.user.is_authenticated:
        response = []
        flashcards = FlashCard.objects.filter(usuario=request.user).values('id', 'pergunta', 'resposta')
        for fc in flashcards:
            response.append({
                'id': str(fc['id']),
                'question': fc['pergunta'],
                'answer': fc['resposta']
            })
        return JsonResponse(response, safe=False)

def saveFlashCard(request):
    if request.user.is_authenticated and request.method == 'POST':
        flashcard = json.loads(request.body)
        fc = FlashCard.objects.create(pergunta=flashcard['question'], resposta=flashcard['answer'], usuario=request.user)
        return JsonResponse({'id': str(fc.id)})
    
def deleteFlashCard(request, id):
    if request.user.is_authenticated and request.method == 'DELETE':
        try:
            flashcard = FlashCard.objects.get(id=id, usuario=request.user)
            flashcard.delete()
            return JsonResponse({'status': 'Flashcard excluído com sucesso'}, status=200)
        except FlashCard.DoesNotExist:
            return JsonResponse({'error': 'Flashcard não encontrado'}, status=404)
    else:
        return JsonResponse({'error': 'Método não permitido ou usuário não autenticado'}, status=405)

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
        'link_login': reverse('singin'),
        'link_login_text': 'Ainda não tem uma conta? Crie aqui!',
        'reset_password_link': reverse('reset_password'),
        'reset_password_link_text': 'Esqueci minha senha.'
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
        'link_login': reverse('login'),
        'link_login_text': 'Já tem uma conta? Faça login aqui!',
    }

    return render(request, 'suplency/enter.html', context)

def logoutView(request):
    logout(request)
    return render(request, 'suplency/logout.html')

def cadernoView(request): 
    from django.conf import settings
   
    response = {}
    if request.user.is_authenticated:
        caderno, criado = Caderno.objects.get_or_create(usuario=request.user)
        materias_response = {}
        if criado:
            materia = Materia.objects.create(caderno=caderno)
            pagina = Pagina.objects.create(materia=materia, numero=0)
            materia.ultima_pagina = pagina
            materia.save()
            caderno.ultima_materia = materia
            caderno.save()
            materias_response = {
                str(materia.id): {
                    'nome': materia.nome,
                    'ultima_pagina': '0',
                    'paginas': [
                        {
                            'id': str(pagina.id),
                            'conteudo': pagina.conteudo
                        }
                    ]
                }
            }
            response = {
                'ultima_materia': str(materia.id),
                'materias': materias_response
            }
            return JsonResponse(response, status=201) 
        else:
            materias = Materia.objects.filter(caderno=caderno)
            for materia in materias:
                paginas_response = []
                for pagina_for in list(Pagina.objects.filter(materia=materia)):
                    paginas_response.append({
                        'id': str(pagina_for.id),
                        'conteudo': pagina_for.conteudo
                    })
                materias_response[str(materia.id)] = {
                    'nome': materia.nome,
                    'ultima_pagina': materia.ultima_pagina.numero if materia.ultima_pagina is not None else 0,
                    'paginas': paginas_response
                }   
            response = {
                'ultima_materia': str(caderno.ultima_materia.id) if caderno.ultima_materia is not None else str(Materia.objects.filter(caderno=caderno).first().id),
                'materias': materias_response
            }
            return JsonResponse(response, status=200) 
    else:
        response = {
            'ultima_materia': '-1',
            'materias':{
                '-1': {
                    'nome': 'Nova matéria',
                    'ultima_pagina': 0,
                    'paginas': [
                        {
                            'id': '-1',
                            'conteudo': '<p><br></p>'
                        }
                    ]
                }
            }
        }
        return JsonResponse(response, status=200)

def get_object(model_class, **params):
    if not isinstance(model_class, type) or not issubclass(model_class, models.Model):
        raise ValueError("O parâmetro model_class deve ser uma classe de modelo Django.")
    
    try:
        obj = model_class.objects.get(**params)
    except model_class.DoesNotExist:
        return None
    return obj

def salvarCaderno(request):
    if request.user.is_authenticated and request.method == 'POST':
        caderno = json.loads(request.body)
        caderno_bd = get_object(Caderno, usuario=request.user)
        
        if not caderno_bd:
            return JsonResponse({'status': 'Caderno não encontrado'}, status=404)
        
        materias = caderno.get('materias', {})
        ultima_materia_id = caderno.get('ultima_materia')
        ultima_materia = None
        
        for key_materia, materia in materias.items():
            materia_bd = get_object(Materia, id=key_materia, caderno=caderno_bd)
            
            if materia_bd:
                materia_bd.nome = materia.get('nome', materia_bd.nome)
                materia_bd.save()
                if str(ultima_materia_id) == str(key_materia):
                    ultima_materia = materia_bd
            elif int(key_materia) < 0:
                materia_bd = Materia.objects.create(nome=materia['nome'], caderno=caderno_bd)
                if str(ultima_materia_id) == str(key_materia):
                    ultima_materia = materia_bd
            else:
                continue
            
            paginas = materia.get('paginas', [])
            for pagina in paginas:
                pagina_bd = get_object(Pagina, id=pagina.get('id'), materia=materia_bd)
                
                if pagina_bd:
                    pagina_bd.conteudo = pagina.get('conteudo', pagina_bd.conteudo)
                    pagina_bd.save()
                elif int(pagina.get('id')) < 0:
                    Pagina.objects.filter(materia=materia_bd, numero__gte=pagina['posicao']).update(numero=F('numero') + 1)
                    pagina_bd = Pagina.objects.create(numero=pagina['posicao'], conteudo=pagina['conteudo'], materia=materia_bd)
            
            materia_bd.ultima_pagina = get_object(Pagina, numero=materia.get('ultima_pagina'), materia=materia_bd)
            materia_bd.save()

        if ultima_materia is not None:
            caderno_bd.ultima_materia = ultima_materia
            caderno_bd.save()
        
        return JsonResponse({'status': 'salvo'}, status=200)
    
    return JsonResponse({'status': 'Método não permitido'}, status=405)