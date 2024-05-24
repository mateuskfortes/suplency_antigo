from django.db import models
from django.contrib.auth.models import AbstractUser
class Usuario(AbstractUser):
    first_name = None
    last_name = None
    
    ultima_materia = models.ForeignKey('Materia', null=True, blank=True, on_delete=models.SET_NULL, related_name='ultima_materia')
    ultima_pagina = models.ForeignKey('Pagina', null=True, blank=True, on_delete=models.SET_NULL, related_name='ultima_pagina')
    
    grupos = models.ManyToManyField(
        'auth.Group',
        related_name='Usuarios',  # Adicione related_name personalizado
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='Usuario',
    )

    permissoes = models.ManyToManyField(
        'auth.Permission',
        related_name='Usuarios',  # Adicione related_name personalizado
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='Usuario',
    )

class Pomodoro(models.Model):
    nome = models.CharField(max_length=30)
    tempo_de_foco = models.TimeField()
    tempo_de_pausa = models.TimeField()
    tempo_de_pausa_longa = models.TimeField()
    numero_focos_ate_pausa_longa = models.PositiveSmallIntegerField()
    
    usuario = models.OneToOneField('Usuario', on_delete=models.CASCADE, related_name='pomodoros')


class Materia(models.Model):
    nome_da_materia = models.CharField(max_length=20)
    cor_da_materia = models.CharField(max_length=6)
    
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='materias')


class Pagina(models.Model):
    numero_da_pagina = models.PositiveIntegerField()
    cor_da_folha = models.CharField(max_length=6)
    conteudo = models.CharField(max_length=1500)
    
    materia = models.ForeignKey('Materia', on_delete=models.CASCADE, related_name='paginas')


class FlashCard(models.Model):
    pergunta = models.CharField(max_length=200)
    resposta = models.CharField(max_length=200)
    
    materias = models.ManyToManyField('Materia', through='FlashCard_Materia')
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='flashcards')
    
class FlashCard_Materia(models.Model):
    materia = models.ForeignKey('Materia', on_delete=models.CASCADE, related_name='materias')
    flash_card = models.ForeignKey('FlashCard', on_delete=models.CASCADE, related_name='flash_card')