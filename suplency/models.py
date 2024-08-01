from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid

class Usuario(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)

    grupos = models.ManyToManyField(
        'auth.Group',
        related_name='usuarios',
        blank=True,
        related_query_name='usuario',
    )

    permissoes = models.ManyToManyField(
        'auth.Permission',
        related_name='usuarios',
        blank=True,
        related_query_name='usuario',
    )

class Pomodoro(models.Model):
    tempo_de_foco = models.DurationField() 
    tempo_de_pausa = models.DurationField() 
    tempo_de_pausa_longa = models.DurationField()  
    numero_focos_ate_pausa_longa = models.PositiveSmallIntegerField()

    usuario = models.OneToOneField('Usuario', null=False, on_delete=models.CASCADE, related_name='pomodoro')

class Caderno(models.Model):
    ultima_materia = models.ForeignKey('Materia', null=True, on_delete=models.SET_NULL, related_name='ultima_materia')
    usuario = models.OneToOneField('Usuario', null=False, on_delete=models.CASCADE, related_name='caderno')

class Materia(models.Model):
    nome = models.CharField(max_length=32, default='Nova matéria')
    cor = models.CharField(max_length=32, default='white')

    ultima_pagina = models.ForeignKey(
        'Pagina', 
        null=True,
        on_delete=models.SET_NULL, 
        related_name='ultima_materia')
    caderno = models.ForeignKey('Caderno', null=False, on_delete=models.CASCADE, related_name='materia')


class Pagina(models.Model):
    numero = models.PositiveIntegerField(null=False)
    cor = models.CharField(max_length=32, default='white')
    conteudo = models.TextField(default='<p></p>')

    materia = models.ForeignKey('Materia', null=False, on_delete=models.CASCADE, related_name='pagina')
    
    class Meta:
        ordering = ['numero']


class FlashCard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    pergunta = models.CharField(max_length=200)
    resposta = models.CharField(max_length=200)

    materias = models.ManyToManyField('Materia', through='FlashCardMateria')
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='flashcard')


class FlashCardMateria(models.Model):
    materia = models.ForeignKey('Materia', on_delete=models.CASCADE, related_name='flashcard_materia')
    flash_card = models.ForeignKey('FlashCard', on_delete=models.CASCADE, related_name='flashcard_materia')
