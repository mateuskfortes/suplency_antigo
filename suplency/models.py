from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Usuario(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)

    ultima_materia = models.ForeignKey('Materia', null=True, blank=True, on_delete=models.SET_NULL, related_name='usuarios_ultima_materia')
    ultima_pagina = models.ForeignKey('Pagina', null=True, blank=True, on_delete=models.SET_NULL, related_name='usuarios_ultima_pagina')

    grupos = models.ManyToManyField(
        'auth.Group',
        related_name='usuarios',  # Adicionado related_name personalizado
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='usuario',
    )

    permissoes = models.ManyToManyField(
        'auth.Permission',
        related_name='usuarios',  # Adicionado related_name personalizado
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='usuario',
    )


class Pomodoro(models.Model):
    tempo_de_foco = models.DurationField()  # Alterado para DurationField
    tempo_de_pausa = models.DurationField()  # Alterado para DurationField
    tempo_de_pausa_longa = models.DurationField()  # Alterado para DurationField
    numero_focos_ate_pausa_longa = models.PositiveSmallIntegerField()

    usuario = models.OneToOneField('Usuario', on_delete=models.CASCADE, related_name='pomodoro')


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

    materias = models.ManyToManyField('Materia', through='FlashCardMateria')
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='flashcards')


class FlashCardMateria(models.Model):
    materia = models.ForeignKey('Materia', on_delete=models.CASCADE, related_name='flashcard_materias')
    flash_card = models.ForeignKey('FlashCard', on_delete=models.CASCADE, related_name='flashcard_materias')
